-- NadyM Database Initialization Script

-- Create databases for each service
CREATE DATABASE IF NOT EXISTS patient_db;
CREATE DATABASE IF NOT EXISTS observance_db;
CREATE DATABASE IF NOT EXISTS telemedicine_db;
CREATE DATABASE IF NOT EXISTS teleexpertise_db;
CREATE DATABASE IF NOT EXISTS rcp_db;
CREATE DATABASE IF NOT EXISTS dcc_db;
CREATE DATABASE IF NOT EXISTS transcription_db;
CREATE DATABASE IF NOT EXISTS interoperability_db;
CREATE DATABASE IF NOT EXISTS security_db;

-- Create users and grant permissions
CREATE USER IF NOT EXISTS 'patient_user'@'%' IDENTIFIED BY 'patient123';
CREATE USER IF NOT EXISTS 'observance_user'@'%' IDENTIFIED BY 'observance123';
CREATE USER IF NOT EXISTS 'telemedicine_user'@'%' IDENTIFIED BY 'telemedicine123';
CREATE USER IF NOT EXISTS 'teleexpertise_user'@'%' IDENTIFIED BY 'teleexpertise123';
CREATE USER IF NOT EXISTS 'rcp_user'@'%' IDENTIFIED BY 'rcp123';
CREATE USER IF NOT EXISTS 'dcc_user'@'%' IDENTIFIED BY 'dcc123';
CREATE USER IF NOT EXISTS 'transcription_user'@'%' IDENTIFIED BY 'transcription123';
CREATE USER IF NOT EXISTS 'interoperability_user'@'%' IDENTIFIED BY 'interoperability123';
CREATE USER IF NOT EXISTS 'security_user'@'%' IDENTIFIED BY 'security123';

-- Grant permissions
GRANT ALL PRIVILEGES ON patient_db.* TO 'patient_user'@'%';
GRANT ALL PRIVILEGES ON observance_db.* TO 'observance_user'@'%';
GRANT ALL PRIVILEGES ON telemedicine_db.* TO 'telemedicine_user'@'%';
GRANT ALL PRIVILEGES ON teleexpertise_db.* TO 'teleexpertise_user'@'%';
GRANT ALL PRIVILEGES ON rcp_db.* TO 'rcp_user'@'%';
GRANT ALL PRIVILEGES ON dcc_db.* TO 'dcc_user'@'%';
GRANT ALL PRIVILEGES ON transcription_db.* TO 'transcription_user'@'%';
GRANT ALL PRIVILEGES ON interoperability_db.* TO 'interoperability_user'@'%';
GRANT ALL PRIVILEGES ON security_db.* TO 'security_user'@'%';

FLUSH PRIVILEGES;