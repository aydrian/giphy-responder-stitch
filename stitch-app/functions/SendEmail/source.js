exports = function(recipient, subData){
  const sparkpostService = context.services.get("SparkPost");
  return sparkpostService.post({
    url: "https://api.sparkpost.com/api/v1/transmissions",
    body: JSON.stringify({
      "campaign_id": "giphy-responder",
      "recipients": [
        {
          "address": recipient
        }
      ],
      "content": {
        "template_id": "giphy-responder"
      },
      "substitution_data": subData
    }),
    headers: {
      "Authorization": [
        context.values.get("sp-api-key")
      ],
      "Content-Type": [
        "application/json"
      ]
    }
  }).then(payload => {
    const body = EJSON.parse(payload.body.text());
    return body.results;
  });
};