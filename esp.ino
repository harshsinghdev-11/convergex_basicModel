#include <ESP8266WiFi.h>
#include <DHT.h>
#include <DHT_U.h>
#include <Adafruit_Sensor.h>

#define DHTPIN D2
#define DHTTYPE DHT11 
DHT dht(DHTPIN, DHTTYPE);

#define SOIL_PIN A0

const char* ssid = "Wifi_name";
const char* password = "password";
const char* server = "Ip of server"; 
const int serverPort = 3000;

WiFiClient client;

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
   int soilMoisture = analogRead(SOIL_PIN);

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  if (isnan(soilMoisture)) {
    Serial.println("Failed to read from soilMoisture sensor!");
    return;
  }

    Serial.print("Soil Moisture Level: ");
  Serial.println(soilMoisture);
  Serial.println(temperature);
  Serial.println(humidity);

if (client.connect(server, serverPort)) {
  Serial.println("Connected to server");
  String postData = "temperature=" + String(temperature) + "&humidity=" + String(humidity) + "&soilMoisture=" + String(soilMoisture);
  client.println("POST /data HTTP/1.1");
  client.println("Host: " + String(server));
  client.println("Content-Type: application/x-www-form-urlencoded");
  client.print("Content-Length: ");
  client.println(postData.length());
  client.println();
  client.println(postData);
  client.stop();
  Serial.println("Data sent successfully");
} else {
  Serial.println("Failed to connect to server");
}

  delay(5000); 
}
