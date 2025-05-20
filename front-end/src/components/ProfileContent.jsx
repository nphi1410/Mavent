import React from 'react';
import styles from './ProfileContent.module.css';

const ProfileContent = () => {
  const userData = {
    fullName: "Khoi Dang Nguyen",
    dateOfBirth: "December 19, 2005",
    gender: "Male",
    email: "khoidangnguyen@gmail.com",
    phone: "Oxxxxxxxxx",
  };

  return (
    <main className={styles.profileContent}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarLarge}>
          useravatar
        </div>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Full Name:</span>
          <span className={styles.detailValue}>{userData.fullName}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Date of Birth:</span>
          <span className={styles.detailValue}>{userData.dateOfBirth}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Gender:</span>
          <span className={styles.detailValue}>{userData.gender}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Email:</span>
          <span className={styles.detailValue}>{userData.email}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Phone:</span>
          <span className={styles.detailValue}>{userData.phone}</span>
        </div>
      </div>

      <div className={styles.actionsSection}>
        <button className={styles.changeInfoButton}>Change Information</button>
      </div>
    </main>
  );
};

export default ProfileContent;