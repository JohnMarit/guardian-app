# API Specification

## 1. API Overview

### 1.1 Introduction

This document outlines the API specifications for the Community Guardian Alert System. The system implements a RESTful API architecture with GraphQL support for complex data queries. All APIs adhere to industry best practices for security, performance, and usability.

### 1.2 API Design Principles

- **RESTful Design**: Resource-oriented design following REST principles
- **Consistency**: Uniform patterns for endpoints, parameters, and responses
- **Security-First**: Authentication and authorization for all endpoints
- **Versioning**: API versioning to support backward compatibility
- **Documentation**: Comprehensive documentation with examples
- **Performance**: Optimized for low latency and high throughput
- **Error Handling**: Consistent error formats with meaningful messages

### 1.3 API Architecture

```
┌────────────────────────────────────────────────────────────┐
│ Client Applications                                        │
│ (Desktop, Web, Mobile)                                     │
└───────────────────────────┬────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ API Gateway                                                │
│ - Authentication                                           │
│ - Rate Limiting                                            │
│ - Request Routing                                          │
│ - Response Caching                                         │
└───────────────────────────┬────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ Microservices                                              │
│                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Auth API    │  │ Alert API   │  │ User API    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Drone API   │  │ Evidence API│  │ Notification│         │
│  └─────────────┘  └─────────────┘  │ API         │         │
│                                    └─────────────┘         │
│                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Location API│  │ Analytics   │  │ ML API      │         │
│  │             │  │ API         │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└────────────────────────────────────────────────────────────┘
```

## 2. Authentication and Authorization

### 2.1 Authentication

#### OAuth 2.0 Authentication Flow

```
POST /api/v1/auth/token
```

Request:
```json
{
  "grant_type": "password",
  "username": "string",
  "password": "string",
  "client_id": "string",
  "client_secret": "string"
}
```

Response:
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": 900,
  "refresh_token": "string",
  "scope": "string"
}
```

#### Token Refresh

```
POST /api/v1/auth/token
```

Request:
```json
{
  "grant_type": "refresh_token",
  "refresh_token": "string",
  "client_id": "string",
  "client_secret": "string"
}
```

Response:
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": 900,
  "refresh_token": "string",
  "scope": "string"
}
```

#### Multi-Factor Authentication

```
POST /api/v1/auth/mfa/initiate
```

Request:
```json
{
  "user_id": "string"
}
```

Response:
```json
{
  "mfa_required": true,
  "mfa_options": ["totp", "sms", "push"],
  "mfa_session_id": "string"
}
```

```
POST /api/v1/auth/mfa/verify
```

Request:
```json
{
  "mfa_session_id": "string",
  "mfa_type": "totp",
  "mfa_code": "string"
}
```

Response:
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": 900,
  "refresh_token": "string",
  "scope": "string"
}
```

### 2.2 Authorization

All API requests must include an `Authorization` header with a valid bearer token:

```
Authorization: Bearer {access_token}
```

## 3. Core API Endpoints

### 3.1 User Management API

#### Get Current User

```
GET /api/v1/users/me
```

Response:
```json
{
  "user_id": "uuid",
  "username": "string",
  "email": "string",
  "phone": "string",
  "org_id": "uuid",
  "roles": [
    {
      "role_id": "uuid",
      "name": "string",
      "permissions": ["string"]
    }
  ],
  "is_active": true,
  "created_at": "ISO-8601 timestamp",
  "last_login": "ISO-8601 timestamp"
}
```

#### Get User by ID

```
GET /api/v1/users/{user_id}
```

Response: Same as Get Current User

#### List Users

```
GET /api/v1/users
```

Query Parameters:
- `org_id` (optional): Filter by organization
- `role_id` (optional): Filter by role
- `is_active` (optional): Filter by active status
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

Response:
```json
{
  "total": 0,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "user_id": "uuid",
      "username": "string",
      "email": "string",
      "org_id": "uuid",
      "is_active": true,
      "created_at": "ISO-8601 timestamp"
    }
  ]
}
```

#### Create User

```
POST /api/v1/users
```

Request:
```json
{
  "username": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "org_id": "uuid",
  "roles": ["uuid"]
}
```

Response:
```json
{
  "user_id": "uuid",
  "username": "string",
  "email": "string",
  "phone": "string",
  "org_id": "uuid",
  "is_active": true,
  "created_at": "ISO-8601 timestamp"
}
```

#### Update User

```
PUT /api/v1/users/{user_id}
```

Request:
```json
{
  "email": "string",
  "phone": "string",
  "org_id": "uuid",
  "is_active": true
}
```

Response:
```json
{
  "user_id": "uuid",
  "username": "string",
  "email": "string",
  "phone": "string",
  "org_id": "uuid",
  "is_active": true,
  "updated_at": "ISO-8601 timestamp"
}
```

#### Delete User

```
DELETE /api/v1/users/{user_id}
```

Response:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 3.2 Alert Management API

#### Get Alert

```
GET /api/v1/alerts/{alert_id}
```

Response:
```json
{
  "alert_id": "uuid",
  "title": "string",
  "description": "string",
  "created_by": "uuid",
  "type_id": "uuid",
  "type_name": "string",
  "location_id": "uuid",
  "location": {
    "name": "string",
    "latitude": 0.0,
    "longitude": 0.0
  },
  "status": "string",
  "severity": 0,
  "created_at": "ISO-8601 timestamp",
  "updated_at": "ISO-8601 timestamp",
  "verified": false,
  "verified_by": "uuid",
  "verified_at": "ISO-8601 timestamp",
  "evidence": [
    {
      "evidence_id": "uuid",
      "type": "string",
      "thumbnail": "string"
    }
  ]
}
```

#### List Alerts

```
GET /api/v1/alerts
```

Query Parameters:
- `status` (optional): Filter by status
- `severity` (optional): Filter by minimum severity
- `type_id` (optional): Filter by alert type
- `location_id` (optional): Filter by location
- `created_by` (optional): Filter by creator
- `verified` (optional): Filter by verification status
- `start_date` (optional): Filter by date range start
- `end_date` (optional): Filter by date range end
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

Response:
```json
{
  "total": 0,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "alert_id": "uuid",
      "title": "string",
      "type_name": "string",
      "location": {
        "name": "string",
        "latitude": 0.0,
        "longitude": 0.0
      },
      "status": "string",
      "severity": 0,
      "created_at": "ISO-8601 timestamp",
      "verified": false
    }
  ]
}
```

#### Create Alert

```
POST /api/v1/alerts
```

Request:
```json
{
  "title": "string",
  "description": "string",
  "type_id": "uuid",
  "location_id": "uuid",
  "severity": 0,
  "evidence_ids": ["uuid"]
}
```

Response:
```json
{
  "alert_id": "uuid",
  "title": "string",
  "description": "string",
  "created_by": "uuid",
  "type_id": "uuid",
  "location_id": "uuid",
  "status": "pending",
  "severity": 0,
  "created_at": "ISO-8601 timestamp"
}
```

#### Update Alert

```
PUT /api/v1/alerts/{alert_id}
```

Request:
```json
{
  "title": "string",
  "description": "string",
  "type_id": "uuid",
  "location_id": "uuid",
  "status": "string",
  "severity": 0
}
```

Response:
```json
{
  "alert_id": "uuid",
  "title": "string",
  "description": "string",
  "type_id": "uuid",
  "location_id": "uuid",
  "status": "string",
  "severity": 0,
  "updated_at": "ISO-8601 timestamp"
}
```

#### Verify Alert

```
POST /api/v1/alerts/{alert_id}/verify
```

Request:
```json
{
  "comments": "string"
}
```

Response:
```json
{
  "alert_id": "uuid",
  "verified": true,
  "verified_by": "uuid",
  "verified_at": "ISO-8601 timestamp",
  "status": "verified"
}
```

#### Get Alert History

```
GET /api/v1/alerts/{alert_id}/history
```

Response:
```json
{
  "alert_id": "uuid",
  "history": [
    {
      "history_id": "uuid",
      "status": "string",
      "updated_by": "uuid",
      "user_name": "string",
      "comments": "string",
      "timestamp": "ISO-8601 timestamp"
    }
  ]
}
```

### 3.3 Evidence API

#### Get Evidence

```
GET /api/v1/evidence/{evidence_id}
```

Response:
```json
{
  "evidence_id": "uuid",
  "alert_id": "uuid",
  "type_id": "uuid",
  "type_name": "string",
  "file_path": "string",
  "thumbnail": "string",
  "metadata": {
    "key": "value"
  },
  "uploaded_by": "uuid",
  "uploaded_at": "ISO-8601 timestamp",
  "verified": false,
  "verified_by": "uuid"
}
```

#### List Evidence

```
GET /api/v1/evidence
```

Query Parameters:
- `alert_id` (optional): Filter by alert
- `type_id` (optional): Filter by evidence type
- `verified` (optional): Filter by verification status
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

Response:
```json
{
  "total": 0,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "evidence_id": "uuid",
      "alert_id": "uuid",
      "type_name": "string",
      "thumbnail": "string",
      "uploaded_at": "ISO-8601 timestamp",
      "verified": false
    }
  ]
}
```

#### Upload Evidence

```
POST /api/v1/evidence
```

Request:
- Multipart form data with file
- Form fields:
  - `alert_id` (optional): Associated alert
  - `type_id`: Evidence type
  - `metadata` (optional): JSON string of metadata

Response:
```json
{
  "evidence_id": "uuid",
  "alert_id": "uuid",
  "type_id": "uuid",
  "file_path": "string",
  "thumbnail": "string",
  "uploaded_by": "uuid",
  "uploaded_at": "ISO-8601 timestamp"
}
```

#### Verify Evidence

```
POST /api/v1/evidence/{evidence_id}/verify
```

Request:
```json
{
  "comments": "string"
}
```

Response:
```json
{
  "evidence_id": "uuid",
  "verified": true,
  "verified_by": "uuid",
  "verified_at": "ISO-8601 timestamp"
}
```

### 3.4 Location API

#### Get Location

```
GET /api/v1/locations/{location_id}
```

Response:
```json
{
  "location_id": "uuid",
  "name": "string",
  "latitude": 0.0,
  "longitude": 0.0,
  "altitude": 0.0,
  "radius": 0.0,
  "parent_id": "uuid",
  "geofence": "GeoJSON",
  "type": "string",
  "created_at": "ISO-8601 timestamp",
  "updated_at": "ISO-8601 timestamp"
}
```

#### List Locations

```
GET /api/v1/locations
```

Query Parameters:
- `parent_id` (optional): Filter by parent location
- `type` (optional): Filter by location type
- `near` (optional): Comma-separated lat,lng coordinates
- `radius` (optional): Search radius in meters when using `near`
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

Response:
```json
{
  "total": 0,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "location_id": "uuid",
      "name": "string",
      "latitude": 0.0,
      "longitude": 0.0,
      "type": "string"
    }
  ]
}
```

#### Create Location

```
POST /api/v1/locations
```

Request:
```json
{
  "name": "string",
  "latitude": 0.0,
  "longitude": 0.0,
  "altitude": 0.0,
  "radius": 0.0,
  "parent_id": "uuid",
  "geofence": "GeoJSON",
  "type": "string"
}
```

Response:
```json
{
  "location_id": "uuid",
  "name": "string",
  "latitude": 0.0,
  "longitude": 0.0,
  "altitude": 0.0,
  "radius": 0.0,
  "parent_id": "uuid",
  "geofence": "GeoJSON",
  "type": "string",
  "created_at": "ISO-8601 timestamp"
}
```

#### Update Location

```
PUT /api/v1/locations/{location_id}
```

Request:
```json
{
  "name": "string",
  "latitude": 0.0,
  "longitude": 0.0,
  "altitude": 0.0,
  "radius": 0.0,
  "parent_id": "uuid",
  "geofence": "GeoJSON",
  "type": "string"
}
```

Response:
```json
{
  "location_id": "uuid",
  "name": "string",
  "latitude": 0.0,
  "longitude": 0.0,
  "altitude": 0.0,
  "radius": 0.0,
  "parent_id": "uuid",
  "geofence": "GeoJSON",
  "type": "string",
  "updated_at": "ISO-8601 timestamp"
}
```

### 3.5 Drone API

#### Get Drone

```
GET /api/v1/drones/{drone_id}
```

Response:
```json
{
  "drone_id": "uuid",
  "model": "string",
  "capabilities": ["string"],
  "status_id": "uuid",
  "status_name": "string",
  "last_mission": "ISO-8601 timestamp",
  "battery": 0,
  "location": {
    "location_id": "uuid",
    "name": "string",
    "latitude": 0.0,
    "longitude": 0.0
  },
  "assigned_to": "uuid",
  "created_at": "ISO-8601 timestamp",
  "updated_at": "ISO-8601 timestamp"
}
```

#### List Drones

```
GET /api/v1/drones
```

Query Parameters:
- `status_id` (optional): Filter by status
- `assigned_to` (optional): Filter by assigned user
- `location_id` (optional): Filter by current location
- `capabilities` (optional): Filter by capabilities (comma separated)
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

Response:
```json
{
  "total": 0,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "drone_id": "uuid",
      "model": "string",
      "status_name": "string",
      "battery": 0,
      "location": {
        "name": "string",
        "latitude": 0.0,
        "longitude": 0.0
      }
    }
  ]
}
```

#### Deploy Drone

```
POST /api/v1/drones/{drone_id}/deploy
```

Request:
```json
{
  "alert_id": "uuid",
  "mission_parameters": {
    "altitude": 0.0,
    "range": 0.0,
    "duration": 0
  }
}
```

Response:
```json
{
  "mission_id": "uuid",
  "drone_id": "uuid",
  "alert_id": "uuid",
  "status": "deployed",
  "estimated_duration": 0,
  "deployed_at": "ISO-8601 timestamp"
}
```

#### Get Drone Data

```
GET /api/v1/drones/{drone_id}/data
```

Query Parameters:
- `start_time` (optional): Filter by time range start
- `end_time` (optional): Filter by time range end
- `alert_id` (optional): Filter by related alert
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

Response:
```json
{
  "total": 0,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "data_id": "uuid",
      "drone_id": "uuid",
      "timestamp": "ISO-8601 timestamp",
      "telemetry": {
        "altitude": 0.0,
        "speed": 0.0,
        "heading": 0.0,
        "position": {
          "latitude": 0.0,
          "longitude": 0.0
        }
      },
      "has_video": true,
      "has_images": true,
      "alert_id": "uuid"
    }
  ]
}
```

### 3.6 Notification API

#### Get Notifications

```
GET /api/v1/notifications
```

Query Parameters:
- `status_id` (optional): Filter by status
- `read` (optional): Filter by read status (true/false)
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

Response:
```json
{
  "total": 0,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "notif_id": "uuid",
      "alert_id": "uuid",
      "type_name": "string",
      "content": "string",
      "status_name": "string",
      "created_at": "ISO-8601 timestamp",
      "read_at": "ISO-8601 timestamp"
    }
  ]
}
```

#### Mark Notification as Read

```
PUT /api/v1/notifications/{notif_id}/read
```

Response:
```json
{
  "notif_id": "uuid",
  "read_at": "ISO-8601 timestamp"
}
```

#### Send Notification

```
POST /api/v1/notifications
```

Request:
```json
{
  "users": ["uuid"],
  "roles": ["uuid"],
  "type_id": "uuid",
  "alert_id": "uuid",
  "content": "string",
  "channel": "string"
}
```

Response:
```json
{
  "success": true,
  "sent_count": 0,
  "failed_count": 0
}
```

### 3.7 Analytics API

#### Alert Statistics

```
GET /api/v1/analytics/alerts
```

Query Parameters:
- `start_date` (optional): Filter by date range start
- `end_date` (optional): Filter by date range end
- `location_id` (optional): Filter by location
- `type_id` (optional): Filter by alert type
- `grouping` (optional): Group by field (day, week, month, type, location, severity)

Response:
```json
{
  "total_alerts": 0,
  "verified_alerts": 0,
  "average_response_time": 0.0,
  "group_by": "day",
  "data": [
    {
      "group": "2023-01-01",
      "count": 0,
      "verified_count": 0,
      "average_severity": 0.0
    }
  ]
}
```

#### Response Time Analysis

```
GET /api/v1/analytics/response-time
```

Query Parameters:
- `start_date` (optional): Filter by date range start
- `end_date` (optional): Filter by date range end
- `location_id` (optional): Filter by location
- `type_id` (optional): Filter by alert type

Response:
```json
{
  "average_time_to_verification": 0.0,
  "average_time_to_response": 0.0,
  "average_time_to_resolution": 0.0,
  "trend": [
    {
      "date": "2023-01-01",
      "verification_time": 0.0,
      "response_time": 0.0,
      "resolution_time": 0.0
    }
  ]
}
```

#### Threat Heatmap

```
GET /api/v1/analytics/heatmap
```

Query Parameters:
- `start_date` (optional): Filter by date range start
- `end_date` (optional): Filter by date range end
- `type_id` (optional): Filter by alert type
- `severity` (optional): Filter by minimum severity
- `resolution` (optional): Grid resolution in meters

Response:
```json
{
  "points": [
    {
      "latitude": 0.0,
      "longitude": 0.0,
      "weight": 0.0
    }
  ],
  "max_weight": 0.0,
  "total_points": 0
}
```

### 3.8 ML API

#### Get Prediction

```
GET /api/v1/ml/predictions/{prediction_id}
```

Response:
```json
{
  "prediction_id": "uuid",
  "model_id": "uuid",
  "model_name": "string",
  "model_version": "string",
  "alert_id": "uuid",
  "confidence": 0.0,
  "metadata": {
    "key": "value"
  },
  "timestamp": "ISO-8601 timestamp",
  "verified": false,
  "verified_by": "uuid"
}
```

#### Analyze Image

```
POST /api/v1/ml/analyze/image
```

Request:
- Multipart form data with image file
- Form fields:
  - `model_id` (optional): Specific model to use
  - `min_confidence` (optional): Minimum confidence threshold

Response:
```json
{
  "prediction_id": "uuid",
  "model_id": "uuid",
  "model_name": "string",
  "confidence": 0.0,
  "results": [
    {
      "label": "string",
      "confidence": 0.0,
      "bounding_box": {
        "x": 0.0,
        "y": 0.0,
        "width": 0.0,
        "height": 0.0
      }
    }
  ],
  "timestamp": "ISO-8601 timestamp"
}
```

#### Analyze Text

```
POST /api/v1/ml/analyze/text
```

Request:
```json
{
  "text": "string",
  "model_id": "uuid",
  "min_confidence": 0.0
}
```

Response:
```json
{
  "prediction_id": "uuid",
  "model_id": "uuid",
  "model_name": "string",
  "confidence": 0.0,
  "results": [
    {
      "label": "string",
      "confidence": 0.0,
      "spans": [
        {
          "start": 0,
          "end": 0,
          "text": "string"
        }
      ]
    }
  ],
  "timestamp": "ISO-8601 timestamp"
}
```

## 4. GraphQL API

### 4.1 GraphQL Endpoint

```
POST /api/v1/graphql
```

### 4.2 Sample Queries

#### Get Alert with Related Data

```graphql
query GetAlert($alertId: ID!) {
  alert(id: $alertId) {
    alert_id
    title
    description
    status
    severity
    created_at
    verified
    creator {
      user_id
      username
    }
    location {
      location_id
      name
      latitude
      longitude
      parent {
        name
      }
    }
    type {
      type_id
      name
      icon
    }
    evidence {
      evidence_id
      file_path
      thumbnail
      type {
        name
      }
      uploaded_by {
        username
      }
      uploaded_at
    }
    history {
      status
      timestamp
      user {
        username
      }
      comments
    }
    predictions {
      model {
        name
        version
      }
      confidence
      verified
    }
  }
}
```

#### Get Alerts in Area

```graphql
query GetAlertsInArea($lat: Float!, $lng: Float!, $radius: Float!, $limit: Int) {
  alertsInArea(latitude: $lat, longitude: $lng, radius: $radius, limit: $limit) {
    alert_id
    title
    severity
    status
    created_at
    location {
      name
      latitude
      longitude
    }
    type {
      name
      icon
    }
    distance
  }
}
```

#### Get User Dashboard Data

```graphql
query GetDashboardData {
  me {
    username
    roles {
      name
    }
  }
  recentAlerts: alerts(limit: 5, orderBy: "created_at", orderDir: "DESC") {
    alert_id
    title
    severity
    status
    created_at
  }
  statistics {
    total_alerts
    pending_verification
    active_alerts
    verified_today
    response_time_avg
  }
  activeThreats: alertsGrouped(status: "active", groupBy: "type") {
    group {
      type_id
      name
    }
    count
    highest_severity
  }
}
```

## 5. Real-time APIs

### 5.1 WebSocket Connections

```
ws://domain/api/v1/ws
```

Authentication via token in query parameter:
```
ws://domain/api/v1/ws?token={access_token}
```

### 5.2 Subscription Topics

#### Alert Updates

```json
{
  "action": "subscribe",
  "topic": "alerts",
  "filters": {
    "location_id": "uuid",
    "min_severity": 3
  }
}
```

#### Notification Updates

```json
{
  "action": "subscribe",
  "topic": "notifications",
  "filters": {}
}
```

#### Drone Status Updates

```json
{
  "action": "subscribe",
  "topic": "drones",
  "filters": {
    "drone_id": "uuid"
  }
}
```

### 5.3 Event Messages

#### Alert Created Event

```json
{
  "event": "alert.created",
  "data": {
    "alert_id": "uuid",
    "title": "string",
    "severity": 0,
    "location": {
      "location_id": "uuid",
      "name": "string",
      "latitude": 0.0,
      "longitude": 0.0
    },
    "created_at": "ISO-8601 timestamp"
  }
}
```

#### Alert Status Update Event

```json
{
  "event": "alert.updated",
  "data": {
    "alert_id": "uuid",
    "previous_status": "string",
    "new_status": "string",
    "updated_at": "ISO-8601 timestamp",
    "updated_by": "uuid"
  }
}
```

#### Notification Received Event

```json
{
  "event": "notification.created",
  "data": {
    "notif_id": "uuid",
    "alert_id": "uuid",
    "type": "string",
    "content": "string",
    "created_at": "ISO-8601 timestamp"
  }
}
```

## 6. API Error Handling

### 6.1 Error Response Format

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {},
    "request_id": "string"
  }
}
```

### 6.2 Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Permission denied |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Invalid input parameters |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

## 7. API Versioning

### 7.1 Version Strategy

- URL-based versioning: `/api/v1/resource`
- All breaking changes require a new API version
- API versions are supported for at least 12 months after deprecation notice

### 7.2 Version Lifecycle

| Version | Status | Release Date | End of Life Date |
|---------|--------|--------------|------------------|
| v1 | Active | [Release Date] | TBD |

## 8. API Rate Limiting

### 8.1 Rate Limit Headers

```
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 99
X-Rate-Limit-Reset: 1623456789
```

### 8.2 Default Rate Limits

| API | Authenticated | Unauthenticated |
|-----|---------------|----------------|
| Authentication | 10/minute | 5/minute |
| User API | 60/minute | N/A |
| Alert API | 300/minute | N/A |
| Evidence API | 60/minute | N/A |
| Location API | 300/minute | 60/minute |
| Drone API | 300/minute | N/A |
| Notification API | 300/minute | N/A |
| Analytics API | 60/minute | N/A |
| ML API | 30/minute | N/A |
| GraphQL API | 60/minute | N/A |
| WebSocket | 5 connections | N/A |

## 9. API Documentation

### 9.1 Interactive Documentation

- OpenAPI/Swagger UI: `/api/docs`
- GraphQL Playground: `/api/graphql`

### 9.2 API SDKs

- JavaScript/TypeScript SDK
- Python SDK
- Java SDK
- Mobile SDKs (iOS, Android)

## 10. API Governance

### 10.1 API Design Guidelines

- Use plural nouns for resource collections
- Use HTTP methods appropriately (GET, POST, PUT, DELETE)
- Provide consistent pagination, filtering, and sorting
- Use standardized error responses
- Implement HATEOAS for API discoverability

### 10.2 API Monitoring and Analytics

- Request volume metrics
- Error rate metrics
- Response time metrics
- Endpoint usage statistics
- Client-specific analytics 