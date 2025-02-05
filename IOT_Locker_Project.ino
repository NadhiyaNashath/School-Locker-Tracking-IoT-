#include <WiFi.h>
#include <WebServer.h>
#include <esp_http_client.h>

const char* ssid = "QCom-2025";
const char* password = "ucsc2025";

WebServer server(80);

const int ledPin = 27;   // LED to indicate door status
const int buttonPin = 25; // Push button for intrusion simulation
const int buzzerPin = 32;
const String correctPassword = "1234";  // Correct password for unlocking

void handleUnlock() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method Not Allowed");
    return;
  }

  // Enable CORS
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  String requestPassword = server.arg("password");

  if (requestPassword == correctPassword) {
    digitalWrite(ledPin, HIGH); // Unlock door (LED ON)
    server.send(200, "text/plain", "Unlocked");
  } else {
    server.send(401, "text/plain", "Incorrect Password");
  }
}

void handleLock() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method Not Allowed");
    return;
  }

  // Enable CORS
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  digitalWrite(ledPin, LOW); // Lock door (LED OFF)
  tone(buzzerPin,0);
  server.send(200, "text/plain", "Locked");
}

void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(204);
}

void sendEmailAlert() {
    esp_http_client_config_t config = {
        .url = "http://maker.ifttt.com/trigger/intrusion_alert/with/key/b7WyRXQSyp9_OdOW_q8yre_lW_HPw-lAguwBCvqma3F",
        .method = HTTP_METHOD_GET,
        .skip_cert_common_name_check = true  // Disable SSL verification
    };

    esp_http_client_handle_t client = esp_http_client_init(&config);
    
    esp_err_t err = esp_http_client_perform(client);
    if (err == ESP_OK) {
        Serial.println("Email alert sent successfully!");
    } else {
        Serial.print("Failed to send email. Error: ");
        Serial.println(esp_err_to_name(err));
    }
    
    esp_http_client_cleanup(client);
}




void checkIntrusion() {
  if (digitalRead(ledPin) == LOW && digitalRead(buttonPin) == LOW){
    digitalWrite(ledPin, HIGH); // Turn LED ON (intrusion detected)
    // digitalWrite(buzzerPin, HIGH);
    tone(buzzerPin, 1000);
    Serial.println("Intrusion detected! Door is now open.");

    sendEmailAlert();
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW); // Start with door locked

  pinMode(buttonPin, INPUT_PULLUP); 
  pinMode(buzzerPin, OUTPUT);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/unlock", HTTP_POST, handleUnlock);
  server.on("/unlock", HTTP_OPTIONS, handleOptions); // Handle CORS preflight

  server.on("/lock", HTTP_POST, handleLock);
  server.on("/lock", HTTP_OPTIONS, handleOptions); // Handle CORS preflight

  server.begin();
}

void loop() {
  server.handleClient();
  checkIntrusion();
}
