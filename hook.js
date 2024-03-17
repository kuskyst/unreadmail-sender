function hook() {
 const threads = GmailApp.search('label:unread');

 if (threads.length == 0) {
   Logger.log('no unread mail !');
   return
 }

 threads.forEach(function (thread) {
    const messages = thread.getMessages();

    const payloads = messages.map(function (message) {
      message.markRead();

      const from = message.getFrom();
      const subject = message.getSubject();
      const plainBody = message.getPlainBody();
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getActiveSheet();
      const webhook = sheet.getRange(1, 1).getValue();

      Logger.log(subject);
      const payload = {
        content: subject,
        embeds: [{
          title: subject,
          author: { name: from },
          description: plainBody.substr(0, 2048),
       }],
      }
      return {
        url: webhook,
        contentType: 'application/json',
        payload: JSON.stringify(payload),
      }
    })
    Logger.log(payloads);
    UrlFetchApp.fetchAll(payloads);
  })
}
