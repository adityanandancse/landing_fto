<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $to = "office@finethreadoverseas.com";
        $subject = "New Waitlist Registration | Fine Thread Overseas";
        
        // HTML email message
        $htmlMessage = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .container { padding: 20px; }
                .header { color: #2563eb; font-size: 24px; margin-bottom: 20px; }
                .content { margin-bottom: 20px; }
                .footer { font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>New Waitlist Registration</div>
                <div class='content'>
                    <p>A new subscriber has joined the Fine Thread Overseas waitlist.</p>
                    <p><strong>Email:</strong> {$email}</p>
                    <p><strong>Date:</strong> " . date("Y-m-d H:i:s") . "</p>
                </div>
                <div class='footer'>
                    <p>This is an automated message from your website's waitlist system.</p>
                </div>
            </div>
        </body>
        </html>";

        // Email headers
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: Fine Thread Overseas <noreply@finethreadoverseas.com>\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Send email
        if (mail($to, $subject, $htmlMessage, $headers)) {
            // Save to a CSV file for backup
            $file = fopen("subscribers.csv", "a");
            fputcsv($file, array($email, date("Y-m-d H:i:s")));
            fclose($file);
            
            // Redirect to thank you page
            header("Location: thanks.html");
            exit();
        } else {
            header("Location: error.html");
            exit();
        }
    } else {
        header("Location: error.html");
        exit();
    }
}
?> 