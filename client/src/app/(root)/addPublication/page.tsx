import PublicationForm from '@/components/PublicationForm'
import PublicationNotification from '@/components/PublicationNotification'
import React from 'react'

const page = () => {
  return (
    <div className='p-8'>     
     <PublicationNotification teacherId="teacher-123" />
      <PublicationForm/>
    </div>
  )
}

export default page
