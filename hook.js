function hook() {
 const threads = GmailApp.search('label:unread');  // 未読のスレッドを取得

 if (threads.length == 0) {
   Logger.log('新規メッセージなし');
   return
 }

 threads.forEach(function (thread) {
   const messages = thread.getMessages();

   const payloads = messages.map(function (message) {
     message.markRead();  // メールを既読に設定する

     const from = message.getFrom();
     const subject = message.getSubject();
     const plainBody = message.getPlainBody();

     const webhook = getWebhookUrl();

     Logger.log(subject);
     const payload = {
       content: subject,
       embeds: [{
         title: subject,
         author: {
           name: from,
         },
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


function getWebhookUrl() {
 const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
 const sheet = spreadsheet.getActiveSheet();

 return sheet.getRange(1, 1).getValue();
}