 import React from 'react' 
import SecurityAuditCard from './_components/SecurityAuditCard'
import SecurityAuditList from './_components/SecurityAuditList'
 function page() {
   return (
     <div>
         <SecurityAuditCard />
         <div>
             <SecurityAuditList />
         </div>
     </div>
   )
 }
 
 export default page