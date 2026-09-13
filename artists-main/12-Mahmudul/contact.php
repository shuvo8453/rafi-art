<?php

/**
 * Contact & Inquiry Mail Handler for MD MAHAMUDUL HASAN Portfolio
 * Designed for cPanel / Apache / LiteSpeed PHP on Namecheap
 */

header('Content-Type: application/json; charset=UTF-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Please submit the form via POST.'
    ]);
    exit;
}

// Destination email
$recipient = 'mahamudul.ban@gmail.com';

// Collect and sanitize input fields
$name = isset($_POST['senderName']) ? trim(strip_tags($_POST['senderName'])) : '';
$email = isset($_POST['senderEmail']) ? trim(filter_var($_POST['senderEmail'], FILTER_SANITIZE_EMAIL)) : '';
$phone = isset($_POST['senderPhone']) ? trim(strip_tags($_POST['senderPhone'])) : 'Not provided';
$purpose = isset($_POST['inquiryType']) ? trim(strip_tags($_POST['inquiryType'])) : 'General Inquiry';
$message = isset($_POST['messageContent']) ? trim(strip_tags($_POST['messageContent'])) : '';

// Basic validations
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please fill in all required fields (Name, Email, and Message).'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please provide a valid email address.'
    ]);
    exit;
}

// Anti-Header Injection check
if (preg_match("/[\r\n]/", $name) || preg_match("/[\r\n]/", $email)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid header characters detected.'
    ]);
    exit;
}

// Construct Email Subject
$subject = "Artwork Inquiry [{$purpose}] from {$name}";

// Construct Email Body (HTML & Plain Text)
$ip_address = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$timestamp = date('Y-m-d H:i:s T');

$email_body = "
======================================================
NEW ARTWORK INQUIRY - MD MAHAMUDUL HASAN PORTFOLIO
======================================================

Sender Name:    {$name}
Sender Email:   {$email}
Phone / Mobile: {$phone}
Inquiry Type:   {$purpose}

------------------------------------------------------
MESSAGE:
------------------------------------------------------
{$message}

------------------------------------------------------
Technical Details:
Date & Time: {$timestamp}
Sender IP:   {$ip_address}
======================================================
";

// Headers
$headers = [];
$headers[] = 'From: Portfolio Inquiry <no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'mahamudulhasan.art') . '>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$header_string = implode("\r\n", $headers);

// Send Email
$mail_sent = @mail($recipient, $subject, $email_body, $header_string);

if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you, ' . htmlspecialchars($name) . '! Your inquiry has been sent successfully. The artist will get back to you shortly.'
    ]);
} else {
    // Fallback: If cPanel mail() has a temporary local MTA delay or misconfiguration
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to send message at this moment. Please email the artist directly at ' . $recipient . ' or call ' . '+880 1708-377154'
    ]);
}
exit;
