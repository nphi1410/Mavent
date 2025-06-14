import React from 'react'
import Table from '../components/arrangement/Table'

const UserDashboardPage = () => {
  const data = [
    { id: 1, name: 'John Doe', age: 30, gender: 'Male' },
    { id: 2, name: 'Jane Smith', age: 25, gender: 'Female' },
    { id: 3, name: 'Bob Johnson', age: 40, gender: 'Male' },
  ];
  
  return (
    <div>
    
    <Table data={data}/>
    </div>
  )
}

export default UserDashboardPage