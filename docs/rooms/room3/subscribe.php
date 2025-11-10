<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve the submitted email
    $email = $_POST['email'];

    // Sanitize the email input to prevent code injection
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);

    // Validate the email format
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // File where we'll store the email addresses
        $file = 'subscribers.txt';

        // Add the email to the file
        file_put_contents($file, $email . PHP_EOL, FILE_APPEND | LOCK_EX);

        // Confirm the subscription
        echo "Thank you for subscribing!";
    } else {
        echo "Invalid email address.";
    }
}
?>
