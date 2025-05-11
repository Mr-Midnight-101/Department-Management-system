/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";

function SampleApi() {
  const [api, setApi] = useState(null); // Initialize as null to handle loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getAlldata");
        console.log("Response Data:", response.data); // Log the response data
        setApi(response.data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error); // Log any errors
      }
    };

    fetchData(); // Call the async function
  }, []); // Empty dependency array to run only once

  return (
    <>
     {api?
     <>
     {api.data.map((item)=>{
      return(
        <tbody>
        <tr>
          <td className="p-2 border-2 border-amber-400">{item._id}</td>
          <td className="p-2 border-2 border-amber-400">{item.email}</td>
          <td className="p-2 border-2 border-amber-400">{item.fullName}</td>
          <td className="p-2 border-2 border-amber-400">{item.contactInfo}</td>
          <td className="p-2 border-2 border-amber-400">{item.avatar}</td>
          <td className="p-2 border-2 border-amber-400">{item.createdAt}</td>
          <td className="p-2 border-2 border-amber-400">{item.username}</td>
          <td className="p-2 border-2 border-amber-400">{item.password}</td>
        </tr>
      </tbody>
      )
     })}
     </>: (<>
     <p>loading..</p></>)
     }
    </>
  );
}

export default SampleApi;
