import React from 'react'

function TeacherManagement() {
 const [teachers, setTeachers] = React.useState([])
 const [departments, setDepartments] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filteredTeachers, setFilteredTeachers] = React.useState([])
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments/')
      if (!response.ok) {
        throw new Error('Failed to fetch departments')
      }
      const data = await response.json()
      setDepartments(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
  
  }

React.useEffect(() => {
  
  fetchDepartments()
}
, [])

  React.useEffect(() => {
    fetchTeachersAndDepartments();
    fetchDepartments
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Teachers</h2>
          <div className="overflow-x-auto">
        
           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                           {departments.map((dept) => (
                             <div
                               key={dept._id}
                               className={`p-4 border rounded-lg cursor-pointer ${
                                 selectedDepartment?._id === dept._id
                                   ? 'border-blue-500 bg-blue-50'
                                   : 'border-gray-200 hover:border-blue-300'
                               }`}
                               onClick={() => setSelectedDepartment(dept)}
                             >
                               <div className="flex justify-between items-start">
                                 <div>
                                   <h5 className="text-sm font-medium text-gray-900">{dept.name}</h5>
                                 </div>
                                
                               </div>
                             </div>

                           ))}
                         </div>


             
                {teachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {departments.find(d => d._id === teacher.department)?.name || 'N/A'}
                    </td>
                  </tr>
                ))}
             
            
          </div>
        </div>
  )
}

export default TeacherManagement;
