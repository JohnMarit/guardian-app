# Database Schema Design

## 1. Entity Relationship Diagram

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ Users         │       │ Organizations │       │ Roles         │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ user_id       │◄──┐   │ org_id        │       │ role_id       │
│ username      │   └───┤ name          │       │ name          │
│ password_hash │       │ description   │       │ permissions   │
│ email         │       │ location      │       │ description   │
│ phone         │       │ parent_org_id │       └───────┬───────┘
│ org_id        │───────┘ type          │             │
│ is_active     │         created_at    │             │
│ created_at    │         updated_at    │             │
│ updated_at    │       └───────────────┘             │
│ last_login    │                                     │
└───────┬───────┘                                     │
        │                                             │
        │       ┌───────────────┐                     │
        └───────┤ User_Roles    │◄────────────────────┘
                ├───────────────┤
                │ user_id       │
                │ role_id       │
                │ assigned_at   │
                │ assigned_by   │
                └───────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ Alerts        │       │ Alert_Types   │       │ Locations     │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ alert_id      │       │ type_id       │       │ location_id   │
│ title         │       │ name          │       │ name          │
│ description   │       │ icon          │       │ latitude      │
│ created_by    │───┐   │ color_code    │       │ longitude     │
│ type_id       │───┼───┘ severity      │       │ altitude      │
│ location_id   │───┼───────────────────┘       │ radius        │
│ status        │   │                           │ parent_id     │
│ severity      │   │   ┌───────────────┐       │ geofence      │
│ created_at    │   │   │ Users         │       │ type          │
│ updated_at    │   └───┤ user_id       │       │ created_at    │
│ verified      │       └───────────────┘       │ updated_at    │
│ verified_by   │                               └───────────────┘
│ verified_at   │
└───────┬───────┘
        │
        │       ┌───────────────┐
        └───────┤ Alert_History │
                ├───────────────┤
                │ history_id    │
                │ alert_id      │
                │ status        │
                │ updated_by    │
                │ comments      │
                │ timestamp     │
                └───────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ Evidence      │       │ Evidence_Types│       │ Alerts        │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ evidence_id   │       │ type_id       │       │ alert_id      │
│ alert_id      │───────┤ name          │       └───────────────┘
│ type_id       │───┐   │ description   │
│ file_path     │   │   │ mime_types    │
│ thumbnail     │   │   └───────────────┘
│ metadata      │   │
│ uploaded_by   │   │   ┌───────────────┐
│ uploaded_at   │   │   │ Users         │
│ verified      │   └───┤ user_id       │
│ verified_by   │       └───────────────┘
└───────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ Notifications │       │ Notif_Types   │       │ Notif_Status  │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ notif_id      │       │ type_id       │       │ status_id     │
│ user_id       │───┐   │ name          │       │ name          │
│ alert_id      │   │   │ template      │       │ description   │
│ type_id       │───┼───┘ priority      │       └───────┬───────┘
│ content       │   │   └───────────────┘               │
│ status_id     │───┼───────────────────────────────────┘
│ created_at    │   │
│ delivered_at  │   │   ┌───────────────┐
│ read_at       │   │   │ Users         │
│ channel       │   └───┤ user_id       │
└───────────────┘       └───────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ Drone_Data    │       │ Drones        │       │ Drone_Status  │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ data_id       │       │ drone_id      │       │ status_id     │
│ drone_id      │───────┤ model         │       │ name          │
│ timestamp     │       │ capabilities  │       │ description   │
│ telemetry     │       │ status_id     │───────┘ is_operational│
│ video_path    │       │ last_mission  │       └───────────────┘
│ image_paths   │       │ battery       │
│ alert_id      │       │ location_id   │
│ metadata      │       │ assigned_to   │
└───────────────┘       │ created_at    │
                        │ updated_at    │
                        └───────────────┘

┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ ML_Models     │       │ ML_Predictions│       │ Alerts        │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ model_id      │       │ prediction_id │       │ alert_id      │
│ name          │       │ model_id      │───────┘               │
│ version       │───────┤ alert_id      │       
│ type          │       │ confidence    │       
│ parameters    │       │ metadata      │       
│ accuracy      │       │ timestamp     │       
│ created_at    │       │ verified      │       
│ trained_at    │       │ verified_by   │       
│ is_active     │       └───────────────┘       
└───────────────┘                              
```

## 2. Table Specifications

### 2.1 Users and Authentication

#### Users
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| user_id        | UUID         | PK                | Unique identifier for user             |
| username       | VARCHAR(50)  | UNIQUE, NOT NULL  | Username for login                     |
| password_hash  | VARCHAR(255) | NOT NULL          | Bcrypt hashed password                 |
| email          | VARCHAR(100) | UNIQUE            | User's email address                   |
| phone          | VARCHAR(20)  | UNIQUE            | User's phone number                    |
| org_id         | UUID         | FK                | Reference to organization              |
| is_active      | BOOLEAN      | DEFAULT TRUE      | Account status                         |
| created_at     | TIMESTAMP    | DEFAULT NOW()     | Account creation timestamp             |
| updated_at     | TIMESTAMP    | DEFAULT NOW()     | Last update timestamp                  |
| last_login     | TIMESTAMP    | NULL              | Last successful login                  |

#### Organizations
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| org_id         | UUID         | PK                | Unique identifier for organization     |
| name           | VARCHAR(100) | NOT NULL          | Organization name                      |
| description    | TEXT         |                   | Organization description               |
| location       | GEOMETRY     |                   | Geographic location                    |
| parent_org_id  | UUID         | FK, NULL          | Reference to parent organization       |
| type           | VARCHAR(50)  | NOT NULL          | Type of organization                   |
| created_at     | TIMESTAMP    | DEFAULT NOW()     | Creation timestamp                     |
| updated_at     | TIMESTAMP    | DEFAULT NOW()     | Last update timestamp                  |

#### Roles
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| role_id        | UUID         | PK                | Unique identifier for role             |
| name           | VARCHAR(50)  | UNIQUE, NOT NULL  | Role name                              |
| permissions    | JSONB        | NOT NULL          | Permission set as JSON                 |
| description    | TEXT         |                   | Role description                       |

#### User_Roles
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| user_id        | UUID         | PK, FK            | Reference to user                      |
| role_id        | UUID         | PK, FK            | Reference to role                      |
| assigned_at    | TIMESTAMP    | DEFAULT NOW()     | Assignment timestamp                   |
| assigned_by    | UUID         | FK                | User who assigned the role             |

### 2.2 Alert Management

#### Alerts
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| alert_id       | UUID         | PK                | Unique identifier for alert            |
| title          | VARCHAR(100) | NOT NULL          | Alert title                            |
| description    | TEXT         | NOT NULL          | Alert description                      |
| created_by     | UUID         | FK, NOT NULL      | Reference to creator user              |
| type_id        | UUID         | FK, NOT NULL      | Reference to alert type                |
| location_id    | UUID         | FK, NOT NULL      | Reference to location                  |
| status         | VARCHAR(20)  | NOT NULL          | Current status                         |
| severity       | INTEGER      | NOT NULL          | Alert severity (1-5)                   |
| created_at     | TIMESTAMP    | DEFAULT NOW()     | Creation timestamp                     |
| updated_at     | TIMESTAMP    | DEFAULT NOW()     | Last update timestamp                  |
| verified       | BOOLEAN      | DEFAULT FALSE     | Verification status                    |
| verified_by    | UUID         | FK, NULL          | User who verified the alert            |
| verified_at    | TIMESTAMP    | NULL              | Verification timestamp                 |

#### Alert_Types
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| type_id        | UUID         | PK                | Unique identifier for alert type       |
| name           | VARCHAR(50)  | UNIQUE, NOT NULL  | Type name                              |
| icon           | VARCHAR(255) |                   | Icon path                              |
| color_code     | VARCHAR(7)   |                   | Color code for UI                      |
| severity       | INTEGER      | DEFAULT 3         | Default severity for this type         |

#### Alert_History
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| history_id     | UUID         | PK                | Unique identifier for history entry    |
| alert_id       | UUID         | FK, NOT NULL      | Reference to alert                     |
| status         | VARCHAR(20)  | NOT NULL          | Status at this point                   |
| updated_by     | UUID         | FK, NOT NULL      | User who made the update               |
| comments       | TEXT         |                   | Optional comments                      |
| timestamp      | TIMESTAMP    | DEFAULT NOW()     | Update timestamp                       |

### 2.3 Locations and Mapping

#### Locations
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| location_id    | UUID         | PK                | Unique identifier for location         |
| name           | VARCHAR(100) | NOT NULL          | Location name                          |
| latitude       | DECIMAL(10,7)| NOT NULL          | Latitude coordinate                    |
| longitude      | DECIMAL(10,7)| NOT NULL          | Longitude coordinate                   |
| altitude       | DECIMAL(8,2) |                   | Altitude in meters                     |
| radius         | DECIMAL(10,2)|                   | Radius in meters for area              |
| parent_id      | UUID         | FK, NULL          | Reference to parent location           |
| geofence       | GEOMETRY     |                   | Geographic boundary                    |
| type           | VARCHAR(50)  | NOT NULL          | Location type                          |
| created_at     | TIMESTAMP    | DEFAULT NOW()     | Creation timestamp                     |
| updated_at     | TIMESTAMP    | DEFAULT NOW()     | Last update timestamp                  |

### 2.4 Evidence Management

#### Evidence
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| evidence_id    | UUID         | PK                | Unique identifier for evidence         |
| alert_id       | UUID         | FK, NOT NULL      | Reference to alert                     |
| type_id        | UUID         | FK, NOT NULL      | Reference to evidence type             |
| file_path      | VARCHAR(255) | NOT NULL          | Path to evidence file                  |
| thumbnail      | VARCHAR(255) |                   | Path to thumbnail                      |
| metadata       | JSONB        |                   | File metadata as JSON                  |
| uploaded_by    | UUID         | FK, NOT NULL      | User who uploaded the evidence         |
| uploaded_at    | TIMESTAMP    | DEFAULT NOW()     | Upload timestamp                       |
| verified       | BOOLEAN      | DEFAULT FALSE     | Verification status                    |
| verified_by    | UUID         | FK, NULL          | User who verified the evidence         |

#### Evidence_Types
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| type_id        | UUID         | PK                | Unique identifier for evidence type    |
| name           | VARCHAR(50)  | UNIQUE, NOT NULL  | Type name                              |
| description    | TEXT         |                   | Type description                       |
| mime_types     | TEXT[]       | NOT NULL          | Allowed MIME types                     |

### 2.5 Notifications

#### Notifications
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| notif_id       | UUID         | PK                | Unique identifier for notification     |
| user_id        | UUID         | FK, NOT NULL      | Target user                            |
| alert_id       | UUID         | FK, NOT NULL      | Reference to related alert             |
| type_id        | UUID         | FK, NOT NULL      | Notification type                      |
| content        | TEXT         | NOT NULL          | Notification content                   |
| status_id      | UUID         | FK, NOT NULL      | Current status                         |
| created_at     | TIMESTAMP    | DEFAULT NOW()     | Creation timestamp                     |
| delivered_at   | TIMESTAMP    | NULL              | Delivery timestamp                     |
| read_at        | TIMESTAMP    | NULL              | Read timestamp                         |
| channel        | VARCHAR(20)  | NOT NULL          | Delivery channel                       |

#### Notif_Types
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| type_id        | UUID         | PK                | Unique identifier for notif. type      |
| name           | VARCHAR(50)  | UNIQUE, NOT NULL  | Type name                              |
| template       | TEXT         | NOT NULL          | Content template                       |
| priority       | INTEGER      | DEFAULT 3         | Priority level (1-5)                   |

#### Notif_Status
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| status_id      | UUID         | PK                | Unique identifier for status           |
| name           | VARCHAR(50)  | UNIQUE, NOT NULL  | Status name                            |
| description    | TEXT         |                   | Status description                     |

### 2.6 Drone Management

#### Drones
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| drone_id       | UUID         | PK                | Unique identifier for drone            |
| model          | VARCHAR(100) | NOT NULL          | Drone model                            |
| capabilities   | TEXT[]       | NOT NULL          | Drone capabilities                     |
| status_id      | UUID         | FK, NOT NULL      | Current status                         |
| last_mission   | TIMESTAMP    | NULL              | Last mission timestamp                 |
| battery        | INTEGER      |                   | Current battery level (%)              |
| location_id    | UUID         | FK, NULL          | Current location                       |
| assigned_to    | UUID         | FK, NULL          | User assigned to this drone            |
| created_at     | TIMESTAMP    | DEFAULT NOW()     | Registration timestamp                 |
| updated_at     | TIMESTAMP    | DEFAULT NOW()     | Last update timestamp                  |

#### Drone_Status
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| status_id      | UUID         | PK                | Unique identifier for status           |
| name           | VARCHAR(50)  | UNIQUE, NOT NULL  | Status name                            |
| description    | TEXT         |                   | Status description                     |
| is_operational | BOOLEAN      | DEFAULT TRUE      | Whether drone can be deployed          |

#### Drone_Data
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| data_id        | UUID         | PK                | Unique identifier for data entry       |
| drone_id       | UUID         | FK, NOT NULL      | Reference to drone                     |
| timestamp      | TIMESTAMP    | DEFAULT NOW()     | Data collection timestamp              |
| telemetry      | JSONB        |                   | Telemetry data as JSON                 |
| video_path     | VARCHAR(255) |                   | Path to video file                     |
| image_paths    | TEXT[]       |                   | Paths to image files                   |
| alert_id       | UUID         | FK, NULL          | Related alert if applicable            |
| metadata       | JSONB        |                   | Additional metadata                    |

### 2.7 Machine Learning

#### ML_Models
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| model_id       | UUID         | PK                | Unique identifier for model            |
| name           | VARCHAR(100) | NOT NULL          | Model name                             |
| version        | VARCHAR(20)  | NOT NULL          | Model version                          |
| type           | VARCHAR(50)  | NOT NULL          | Model type                             |
| parameters     | JSONB        | NOT NULL          | Model parameters                       |
| accuracy       | DECIMAL(5,4) | NOT NULL          | Model accuracy score                   |
| created_at     | TIMESTAMP    | DEFAULT NOW()     | Creation timestamp                     |
| trained_at     | TIMESTAMP    | NOT NULL          | Training completion timestamp          |
| is_active      | BOOLEAN      | DEFAULT FALSE     | Whether model is in active use         |

#### ML_Predictions
| Column         | Type         | Constraints       | Description                            |
|----------------|--------------|-------------------|----------------------------------------|
| prediction_id  | UUID         | PK                | Unique identifier for prediction       |
| model_id       | UUID         | FK, NOT NULL      | Reference to model                     |
| alert_id       | UUID         | FK, NOT NULL      | Reference to alert                     |
| confidence     | DECIMAL(5,4) | NOT NULL          | Prediction confidence score            |
| metadata       | JSONB        | NOT NULL          | Prediction details                     |
| timestamp      | TIMESTAMP    | DEFAULT NOW()     | Prediction timestamp                   |
| verified       | BOOLEAN      | DEFAULT FALSE     | Whether verified by human              |
| verified_by    | UUID         | FK, NULL          | User who verified                      |

## 3. Database Optimization

### 3.1 Indexing Strategy

| Table          | Index Type       | Columns                          | Purpose                                |
|----------------|------------------|----------------------------------|----------------------------------------|
| Users          | B-tree           | username                         | Fast user lookup during login          |
| Users          | B-tree           | email                            | User lookup by email                   |
| Users          | B-tree           | org_id                           | Filter users by organization           |
| Alerts         | B-tree           | created_at                       | Chronological sorting                  |
| Alerts         | B-tree           | status, severity                 | Filter by status and severity          |
| Alerts         | B-tree           | created_by                       | Filter alerts by creator               |
| Alerts         | GiST             | location_id                      | Spatial queries                        |
| Locations      | GiST             | geofence                         | Spatial containment queries            |
| Notifications  | B-tree           | user_id, status_id               | Filter notifications by user and status|
| Notifications  | B-tree           | created_at                       | Chronological sorting                  |
| Evidence       | B-tree           | alert_id                         | Filter evidence by alert               |
| Drone_Data     | B-tree           | drone_id, timestamp              | Filter and sort drone data            |
| ML_Predictions | B-tree           | alert_id                         | Filter predictions by alert            |
| ML_Predictions | B-tree           | confidence                       | Sort by confidence                     |

### 3.2 Partitioning Strategy

#### Time-Based Partitioning
- **Alert_History**: Partitioned by month
- **Notifications**: Partitioned by month
- **Drone_Data**: Partitioned by week

#### Range Partitioning
- **Alerts**: Partitioned by severity
- **ML_Predictions**: Partitioned by confidence ranges

### 3.3 Query Optimization

#### Materialized Views
- **Active_Alerts**: Alerts with status 'active' or 'pending verification'
- **User_Notification_Count**: Count of unread notifications per user
- **Location_Alert_Summary**: Count of alerts by location and type

#### Stored Procedures
- **CreateAlert**: Validate and create new alert with proper permissions
- **VerifyAlert**: Process for alert verification including evidence check
- **NotifyUsers**: Logic for determining notification recipients based on alert

### 3.4 Data Retention and Archiving

#### Retention Policies
- **Alert_History**: Keep all records indefinitely
- **Notifications**: Archive after 90 days
- **Drone_Data**: Raw data compressed after 30 days, archived after 1 year
- **ML_Predictions**: Keep all for model improvement

#### Archiving Strategy
- Use table partitioning to move older data to cold storage
- Create compressed backup of archived data
- Maintain searchable metadata for archived content

## 4. Data Migration and Maintenance

### 4.1 Initial Data Loading

1. Import geographic boundaries and locations
2. Set up organization hierarchy
3. Create initial user accounts and roles
4. Import historical alert data if available

### 4.2 Database Maintenance

#### Regular Tasks
- Weekly index maintenance (REINDEX)
- Monthly vacuum full for table optimization
- Quarterly archiving of old data
- Daily backup with point-in-time recovery

#### Monitoring
- Set up alerts for:
  - Disk space usage > 80%
  - Query performance degradation
  - Index bloat > 30%
  - Connection count > 80% of max
  - Replication lag > 30 seconds

### 4.3 Scaling Considerations

#### Vertical Scaling
- Increase CPU/RAM for database server as user count grows
- Optimize for SSD storage for frequently accessed tables

#### Horizontal Scaling
- Implement read replicas for reporting and analytics
- Consider database sharding if data volume exceeds 500GB 