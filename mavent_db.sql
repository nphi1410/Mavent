use mavent_db;
CREATE TABLE accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    system_role ENUM('SUPER_ADMIN', 'USER') DEFAULT 'USER' NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    avatar_img VARCHAR(255),
    phone VARCHAR(255) UNIQUE,
    gender ENUM('MALE', 'FEMALE', 'OTHER') DEFAULT 'OTHER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    location VARCHAR(255),
    dday_info TEXT,
    max_member_number INT CHECK (max_member_number >= 0) DEFAULT 0,
    max_participant_number INT CHECK (max_participant_number >= 0) DEFAULT 0,
    status ENUM('RECRUITING', 'UPCOMING', 'ONGOING', 'ENDED', 'CANCELLED', 'PENDING', 'REVIEWING') DEFAULT 'PENDING',
    created_by_account_id INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_account_id) REFERENCES accounts(account_id)
);
CREATE TABLE proposals (-- Nhớ thêm phần thông báo đến người thêm proposal add quyền truy cập drive
    proposal_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    proposal_link VARCHAR(255) NOT NULL,
    status ENUM('DRAFT', 'SUBMITTED', 'REVIEWED', 'APPROVED', 'REJECTED', 'REVISING') DEFAULT 'DRAFT',
    notes TEXT,
    created_by_account_id INT NOT NULL,
    defense_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (created_by_account_id) REFERENCES accounts(account_id)
);


CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE event_account_role (
    event_id INT NOT NULL,
    account_id INT NOT NULL,
    event_role ENUM('ADMIN', 'DEPARTMENT_MANAGER', 'MEMBER', 'PARTICIPANT', 'GUEST') DEFAULT 'GUEST' NOT NULL,
    department_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    assigned_by_account_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, account_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (assigned_by_account_id) REFERENCES accounts(account_id)
);

CREATE TABLE tasks (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    department_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to_account_id INT,
    assigned_by_account_id INT NOT NULL,
    due_date DATETIME,
    status ENUM('TODO', 'DOING', 'DONE', 'FEEDBACK_NEEDED', 'REJECTED', 'CANCELLED') DEFAULT 'TODO',
    priority ENUM('OPTIONAL','LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (assigned_to_account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (assigned_by_account_id) REFERENCES accounts(account_id)
);

CREATE TABLE task_feedback (-- do admin & department manager xây dựng
    task_feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    feedback_by_account_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id),
    FOREIGN KEY (feedback_by_account_id) REFERENCES accounts(account_id)
);

CREATE TABLE event_feedback (-- for participant
    event_id INT NOT NULL,
    account_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, account_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);
CREATE TABLE request_types (
    request_type_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Thay thế bảng Requests hiện tại
CREATE TABLE requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    request_by_account_id INT NOT NULL,
    event_id INT,
    task_id INT,
    department_id INT,
    request_type_id INT NOT NULL,
    content TEXT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
    response_by_account_id INT,
    response_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_by_account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (response_by_account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (request_type_id) REFERENCES request_types(request_type_id)
);

CREATE TABLE timeline_items (-- cho participant % guest view
    timeline_item_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    item_datetime DATETIME NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by_account_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (created_by_account_id) REFERENCES accounts(account_id)
);

CREATE TABLE meetings (
    meeting_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    department_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_datetime DATETIME NOT NULL,
    end_datetime DATETIME,
    location VARCHAR(255),
    meeting_link VARCHAR(255),
    status ENUM('SCHEDULED', 'CANCELLED', 'COMPLETED', 'POSTPONED') DEFAULT 'SCHEDULED',
    organizer_account_id INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (organizer_account_id) REFERENCES accounts(account_id)
);

CREATE TABLE meeting_attendees (
    meeting_id INT NOT NULL,
    account_id INT NOT NULL,
    attendance_status ENUM('ATTENDED', 'ABSENT') DEFAULT 'ABSENT',
    PRIMARY KEY (meeting_id, account_id),
    FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE agenda (
    agenda_item_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME,
    end_time DATETIME,
    created_by_account_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (created_by_account_id) REFERENCES accounts(account_id)
);

CREATE TABLE documents (-- Nếu chỉ 2 ban cần xem và các ban khác không cần xem thì tạo bảng này
    document_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    department_id INT,
    uploader_account_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (uploader_account_id) REFERENCES accounts(account_id)
);

CREATE TABLE task_attendees (
    task_id INT NOT NULL,
    account_id INT NOT NULL,
    status ENUM('INVITED', 'ACCEPTED', 'DECLINED', 'ATTENDED') DEFAULT 'INVITED',
    PRIMARY KEY (task_id, account_id),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    recipient_account_id INT NOT NULL,
    sender_account_id INT,
    event_id INT,
    request_id INT,
    task_id INT,
    type VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (sender_account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (request_id) REFERENCES requests(request_id),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id)
);

CREATE TABLE audit_log (
    id CHAR(36) PRIMARY KEY,
    table_name VARCHAR(64) NOT NULL,
    record_id CHAR(36) NOT NULL,
    changed_by INT NOT NULL,  -- Changed from CHAR(36) to INT to match account_id
    change_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    change_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    old_data TEXT,
    new_data TEXT,
    FOREIGN KEY (changed_by) REFERENCES accounts(account_id) ON DELETE RESTRICT
);

-- Financial tables for tracking budgets, expenses, and income
CREATE TABLE budgets (-- Tổng tiền của 1 sự kiện
    budget_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    total_amount BIGINT NOT NULL,
    spent_amount BIGINT,-- thực chi 
    -- status ENUM('DRAFT', 'PENDING', 'APPROVED', 'CLOSED') DEFAULT 'DRAFT',
    -- approved_by_account_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE expense_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    -- is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    expense_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    budget_id INT,
    category_id INT NOT NULL,
    department_id INT,
    amount BIGINT NOT NULL,
    note TEXT NOT NULL,
    payment_date DATE,
    payment_method VARCHAR(100),
    receipt_url VARCHAR(255),
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'PAID') DEFAULT 'PENDING',
    created_by_account_id INT NOT NULL,
    approved_by_account_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (budget_id) REFERENCES budgets(budget_id),
    FOREIGN KEY (category_id) REFERENCES expense_categories(category_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (created_by_account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (approved_by_account_id) REFERENCES accounts(account_id)
);

CREATE TABLE income (-- Tạm thời các sự kiện chưa mất phí và income duy nhất đến từ sponsor
    income_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    amount BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source_type ENUM('SPONSOR', 'TICKET_SALES', 'MERCHANDISE', 'DONATION', 'OTHER') NOT NULL,
    source_id INT, -- References sponsor_id if source is sponsor
    received_date DATE,
    received_by_account_id INT,-- admin
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (received_by_account_id) REFERENCES accounts(account_id)
);

-- Sponsor tables for managing event sponsors and sponsorship packages
CREATE TABLE sponsors (
    sponsor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    website VARCHAR(255),
    industry VARCHAR(100),
    address TEXT,
    contact_person_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(100),
    notes TEXT,
    created_by_account_id INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_account_id) REFERENCES accounts(account_id)
);

-- CREATE TABLE sponsorship_packages (
--     package_id INT PRIMARY KEY AUTO_INCREMENT,
--     event_id INT NOT NULL,
--     name VARCHAR(100) NOT NULL,
--     amount DECIMAL(15, 2) NOT NULL,
--     description TEXT,
--     benefits TEXT,
--     max_sponsors INT,
--     is_active BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (event_id) REFERENCES events(event_id)
-- );

-- CREATE TABLE event_sponsorships (--Có thể thay thế bằng request
--     event_sponsorship_id INT PRIMARY KEY AUTO_INCREMENT,
--     event_id INT NOT NULL,
--     sponsor_id INT NOT NULL,
--     package_id INT,
--     amount BIGINT NOT NULL,
--     status ENUM('INTERESTED', 'NEGOTIATING', 'CONFIRMED', 'PAID', 'FULFILLED') DEFAULT 'INTERESTED',
--     start_date DATE,
--     end_date DATE,
--     notes TEXT,
--     agreement_document_url VARCHAR(255),
--     main_contact_account_id INT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (event_id) REFERENCES events(event_id),
--     FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id),
--     FOREIGN KEY (package_id) REFERENCES sponsorship_packages(package_id),
--     FOREIGN KEY (main_contact_account_id) REFERENCES accounts(account_id)
-- );