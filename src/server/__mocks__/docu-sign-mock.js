export default returnUrl => `<!DOCTYPE html>
  <html>
    <head>
      <title>Simple Mock of DocuSign page</title>
    </head>
    <body style="background: whitesmoke">
      <h1>Simple Mock of DocuSign page</h1>
      <div>
        Use the buttons below to mock the signature, or rejection of the signature.
      </div>
      <button onclick="sign()">Sign</button>
      <button onclick="reject()">Reject</button>
      <script>
        function reject() {
          console.log("Document is rejected!");
          window.location = "${returnUrl}?event=decline"
        }
        function sign() {
          console.log("Document is signed!");
          window.location = "${returnUrl}?event=signing_complete"
        }
      </script>
    </body>
  </html>`;
