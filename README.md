# MAVENT

<div align="center">
  <img src="./front-end/public/mavent-text-logo.svg" alt="Mavent Logo" width="400"/>
  <p><em>Advanced Event Management Platform</em></p>
</div>

## � Overview

Mavent is a comprehensive event management system designed to streamline the entire event lifecycle from planning to execution. Developed as part of the SWP391 course at FPT University, Mavent offers intuitive tools for event creation, attendee management, resource allocation, and real-time analytics.

The platform supports multiple user roles with customized access levels and provides integrated solutions for meetings, document management, and participant feedback. Mavent stands out with its visual dashboards and location-based services to enhance the event organization experience.

## 🚀 Key Features

- **Event Management**
  - Create, update, and track events through their entire lifecycle
  - Flexible scheduling with support for multiple event types
  - Tag-based categorization and search functionality

- **Team Coordination**
  - Role-based access control system
  - Department assignment and management
  - Member tracking and participation analytics

- **Meeting Organization**
  - Schedule and manage event-related meetings
  - Meeting attendance tracking
  - Calendar integration and notifications

- **Resource Management**
  - Document upload and versioning
  - Secure storage with access controls
  - File categorization and tagging

- **Administrative Controls**
  - Comprehensive admin dashboard
  - User permission management
  - System-wide monitoring tools

- **Data Visualization**
  - Real-time participation analytics
  - Feedback collection and analysis
  - Visual representation of event metrics

- **Location Services**
  - Interactive maps for venue locations
  - Directions and location sharing
  - Geographical data visualization

## 🔧 Technology Stack

### Backend Architecture
- **Framework**: Spring Boot 3.4.5
- **Language**: Java 21
- **Database**: MySQL
- **Security**: Spring Security, JWT Authentication
- **ORM**: Spring Data JPA
- **Storage**: Azure Blob Storage
- **Build Tool**: Maven

### Frontend Development
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Data Visualization**: Chart.js, Recharts
- **Mapping**: React Leaflet
- **Icons**: FontAwesome, Lucide React

## 🏗️ Project Structure

The project follows a modern microservice-oriented architecture:

### Backend Structure
```
back-end/
├── src/
│   ├── main/
│   │   ├── java/com/mavent/dev/
│   │   │   ├── config/         # Application configuration
│   │   │   ├── controller/     # REST API endpoints
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── entity/        # Database models
│   │   │   ├── repository/    # Database access layer
│   │   │   ├── service/       # Business logic
│   │   │   │   └── implement/ # Service implementations
│   │   │   └── util/         # Utility classes
│   │   └── resources/
│   │       └── application.properties
│   └── test/                  # Unit and integration tests
```

### Frontend Structure
```
front-end/
├── public/                   # Static assets
├── src/
│   ├── assets/               # Images, fonts, etc.
│   ├── auth/                 # Authentication components
│   ├── components/           # Reusable UI components
│   ├── config/               # Application configuration
│   ├── context/              # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── layouts/              # Page layouts
│   ├── pages/                # Application views
│   ├── services/             # API service integrations
│   ├── style/                # Global styles
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Application root component
│   └── main.jsx              # Entry point
```



## 👥 Development Team

This project was developed by the SWP391 team at FPT University:
- **Leader**: [Nguyễn Vũ Đăng Khánh](https://github.com/nvdekay)
- **Technical Leader**: [Nguyễn Phi Phi](https://github.com/DevPhiCap)
- **Developer**: [Trần Xuân Hùng](https://github.com/HungTXHE194146) 
- **Developer**: [Nguyễn Đăng Khôi](https://github.com/ndkhoi192) 
- **Developer**: [Nguyễn Thị Minh Anh](https://github.com/anhntm05) 


## 📄 License

© 2025 Mavent. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use of this software is strictly prohibited.
