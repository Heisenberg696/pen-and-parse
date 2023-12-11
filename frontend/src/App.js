
import Navbar from "./components/navbar/navbar";
import Leftbar from "./components/leftbar/leftbar";
import {
  createBrowserRouter,
  
  Outlet,
  RouterProvider,
  // Routes,
} from "react-router-dom";
import SummarizerTwo from "./components/summarizer/SummarizerTwo";
import TextReader from "./components/reader/TextReader";


function App() {
  
  const Layout = () => {
  

    return(
      <div>
      <Navbar />
        <div style= {{display: "flex"}}>
        <Leftbar />
        <Outlet/>
        </div>    
      </div>
    )

  }

  const router = createBrowserRouter([
    {
      path:"/",
      element: <Layout/>,
      children:[
      {
        path:"/reader",
        element: <TextReader/>
      },
      {
        path:"/summarizer",
        element: <SummarizerTwo/>
      }
      ]
    },
  ]);

  return (
    <div >
     <RouterProvider router={router} />
    </div>
  );
}


export default App;
