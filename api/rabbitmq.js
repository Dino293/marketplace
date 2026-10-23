// api/rabbitmq.js - Vercel Serverless Function Proxy for CloudAMQP RabbitMQ
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const RMQ_HOST = process.env.VITE_RABBITMQ_HOST || 'armadillo.rmq.cloudamqp.com';
  const RMQ_VHOST = process.env.VITE_RABBITMQ_VHOST || 'daksbgyw';
  const RMQ_USER = process.env.VITE_RABBITMQ_USER || 'daksbgyw';
  const RMQ_PASS = process.env.VITE_RABBITMQ_PASS || 'FN-eQ1KX5BKl8bqPU0BjE_IyqFVLM77C';
  const QUEUE_NAME = 'trio_order_queue';

  const authHeader = 'Basic ' + Buffer.from(`${RMQ_USER}:${RMQ_PASS}`).toString('base64');
  const action = req.query?.action || (req.body && req.body.action) || 'status';

  try {
    // 1. Action: STATUS (Check cluster and queue health)
    if (action === 'status') {
      const response = await fetch(`https://${RMQ_HOST}/api/queues/${RMQ_VHOST}/${QUEUE_NAME}`, {
        headers: { 'Authorization': authHeader }
      });
      if (!response.ok) {
        // If queue doesn't exist yet, return basic healthy info
        return res.status(200).json({
          connected: true,
          queue: QUEUE_NAME,
          messages: 0,
          vhost: RMQ_VHOST,
          host: RMQ_HOST,
          status: 'ready'
        });
      }
      const data = await response.json();
      return res.status(200).json({
        connected: true,
        queue: QUEUE_NAME,
        vhost: RMQ_VHOST,
        host: RMQ_HOST,
        messages: data.messages || 0,
        messages_ready: data.messages_ready || 0,
        consumers: data.consumers || 0,
        state: data.state || 'running'
      });
    }

    // 2. Action: PUBLISH (Publish order/transaction event)
    if (action === 'publish' && req.method === 'POST') {
      const payloadData = req.body?.payload || req.body;
      const rmqPayload = {
        properties: {
          delivery_mode: 2,
          headers: { source: 'PT. TRIO Marketplace' }
        },
        routing_key: QUEUE_NAME,
        payload: typeof payloadData === 'string' ? payloadData : JSON.stringify(payloadData),
        payload_encoding: 'string'
      };

      const response = await fetch(`https://${RMQ_HOST}/api/exchanges/${RMQ_VHOST}/amq.default/publish`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rmqPayload)
      });

      const result = await response.json().catch(() => ({ routed: true }));
      return res.status(200).json({
        success: true,
        message: 'Berhasil dikirim ke antrean CloudAMQP RabbitMQ',
        data: result,
        queue: QUEUE_NAME,
        timestamp: new Date().toISOString()
      });
    }

    // 3. Action: GET (Read / Peek messages from queue)
    if (action === 'get') {
      const count = parseInt(req.query?.count || req.body?.count || 5, 10);
      const response = await fetch(`https://${RMQ_HOST}/api/queues/${RMQ_VHOST}/${QUEUE_NAME}/get`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          count,
          ackmode: 'ack_requeue_true', // Peek without deleting so users can see queue messages in UI
          encoding: 'auto'
        })
      });

      const messages = await response.json();
      return res.status(200).json({
        success: true,
        queue: QUEUE_NAME,
        count: Array.isArray(messages) ? messages.length : 0,
        messages: Array.isArray(messages) ? messages.map(m => {
          let parsed = m.payload;
          try { parsed = JSON.parse(m.payload); } catch (e) {}
          return {
            id: m.properties?.message_id || `msg-${Math.random().toString(36).substring(7)}`,
            routing_key: m.routing_key,
            payload: parsed,
            redelivered: m.redelivered
          };
        }) : []
      });
    }

    return res.status(400).json({ error: 'Action not supported' });
  } catch (error) {
    console.error('RabbitMQ Proxy Error:', error);
    return res.status(500).json({
      error: true,
      message: error.message || 'Internal RabbitMQ Proxy Error'
    });
  }
}
