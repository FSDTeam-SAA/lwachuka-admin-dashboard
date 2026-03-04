import React from 'react'
import PaymentManagementCard from './_components/PaymentManagementCard'
import PaymentManagement from './_components/PaymentManagement'

function page() {
  return (
    <div>
        <PaymentManagementCard />
        <div>
            <PaymentManagement />
        </div>
    </div>
  )
}

export default page