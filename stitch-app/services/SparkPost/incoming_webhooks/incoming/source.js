exports = function(payload) {
  const body = EJSON.parse(payload.body.text());
  
  const relayMsg = body[0].msys.relay_message;
  const localpart = relayMsg.rcpt_to.split('@')[0];
  const from = relayMsg.friendly_from || relayMsg.msg_from;
  const subject = relayMsg.content.subject;
  console.log('Email received from: ', from);
  console.log('Searching for: ', subject);
  context.functions.execute("GiphySearch", subject).then(gifs => {
    const mongodb = context.services.get("mongodb-atlas");
    return mongodb.db('porg').collection('responses').insertOne({
      "localpart": localpart,
      "from": from,
      "search": subject,
      "gifs": gifs,
      "relayMsg": relayMsg,
      "ts": new Date()
    }).then(result => {
      let subData = {
        search: subject,
        gifs: gifs
      };
      return subData;
    });
  }).then(subData => {
    console.log('Substitution Data: ', JSON.stringify(subData));
    return context.functions.execute("SendEmail", from, subData);
  }).then(result => {
    console.log('Send Result: ', JSON.stringify(result));
    return;
  }).catch(err => {
    console.log('Error: ', JSON.stringify(err));
  });
};