import React, { useEffect, useState } from 'react'
import Header from "../Header/Header";
import axios from "axios";
import User from "../User/User";

const URL = "http://localhost:5000/users";

const fetchHandler =async ()=>{
  return await axios.get(URL).then((res) =>res.data);
}
function Dashboard() {

  const [users , setUsers] = useState();
  useEffect(()=>{
    fetchHandler().then((data)=> setUsers(data.users));
  },[])

  return (
    <div>
        <Header></Header>
      <h1>User  details diaplay </h1>
      <div>
        {users && users.map((user, i)=>(
          <div key={i}>
            <User User={user}/>
            </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
