import { useState,useRef,useEffect, useReducer } from "react";
import {db} from "../firebaseInit";
import { collection, doc, deleteDoc, addDoc, getDocs, onSnapshot,setDoc } from "firebase/firestore"; 


//reducer function--depending upon what type of action is performed depending on it we will return the next state
//like it it is ADD then we will return the next state which wil add the blogs to the blogs array if it is REMOVE then remove it from blog array
function blogsReducer(state,action){
    switch(action.type){
        case "ADD":
            return [action.blog,...state]  //if type is coming from action the blog will also come from action

        case "REMOVE":
            return state.filter((blog,index) => index!==action.index) //index!==action.index only that blog will be left out means if condition is true put it inside new filtered array

        default:
            return [];
    }
}

//Blogging App using Hooks
export default function Blog(){

    // const[title,setTitle] = useState("");
    // const[content,setContent] = useState("");

    const[formData, setFormData] = useState({title:"",content:""})

    //empty array(for now) for holding content and title when we submit it
    const[blogs,setBlogs] = useState([]); //INITIALLY our blogs are empty

    //const [blogs,dispatch] = useReducer(blogsReducer, []);
    const titleRef = useRef(null); 

    useEffect(()=>{
        titleRef.current.focus();
    },[])

    useEffect(() =>{
        if(blogs.length && blogs[0].title){
            document.title = blogs[0].title;
        }
        else{
            document.title = "No Blogs!!"
        }
    },[blogs])

    useEffect(()=>{

        //this is by getDocs

        // async function fetchData(){
        //     const snapShot =  await getDocs(collection(db,"blogs"));       //snapShot will return some array we are saving the array in snapshot
        //     console.log(snapShot);
        //     //Now fetching all the data from docs    ...from doc i will get the whole data
        //     //inside blogs i will save all the values/doc which i am looping over through map
        //     const blogs = snapShot.docs.map((doc)=>{
        //         return{
        //             id: doc.id,
        //             ...doc.data()
        //         }   //now blogs will be having id and all data
        //     })

        //     console.log(blogs);  
        //     setBlogs(blogs);  // i have everything in blogs so use setBlogs (i have already useState over it which is returning us setBlogs) ,, i will now setBlogs to blogs

        // }

        // fetchData();


        //Now to get realtime update with cloud firestore we are using onSnapshot -a listener which will give us realtime update
        //whenever you are deleting or adding it will send that notification to cloud

        const unsub = onSnapshot(collection(db,"blogs"),(snapShot)=>{
            const blogs = snapShot.docs.map((doc)=>{
                        return{
                            id: doc.id,
                            ...doc.data()
                        }   //now blogs will be having id and all data
                    })
        
                    console.log(blogs);  
                    setBlogs(blogs);
        })

    },[])
    
    //Passing the synthetic event as argument to stop refreshing the page on submit
    async function handleSubmit(e){
        e.preventDefault();

        //now we can fetch everything data from the blog and actually map it using map function and display it on screen
        //setBlogs([{title: formData.title,content: formData.content},...blogs]);  //whatever is there already in blog after current title and current content it will give everything from blogs array
        //above line is commented as i dont want to set blogs manually now beacuse i have set it using onSnapshot to get realtime update


        //Add a new document with a generated id.
    try {
        const docRef = await addDoc(collection(db, "blogs"), {
        title: formData.title,
        content: formData.content,
        createdOn: new Date()
        });
        //console.log("Document written with ID: ", docRef.id);
        } 
    catch (e) {
        //console.error("Error adding document: ", e);
    }
        
        //dispatch({type:"ADD",blog:{title: formData.title,content: formData.content}})


        setFormData({title:"",content: ""});
        // setTitle("");
        // setContent("");

        //titleRef.current.focus(); //title ref is assigned to input field that have title in it

    }

    async function removeBlog(id){

        //we will filter out all those blogs whose index number doesnt match with deleted blog

        //setBlogs(blogs.filter((blog,index)=> i!==index));

        //replacing setblogs with dispatch function
        //dispatch({type: "REMOVE", index: i})

        const docRef = doc(db,"blogs",id);
        await deleteDoc(docRef);

    }

    return(
        <>
        {/* Heading of the page */}
        <h1>Write a Blog!</h1>

        {/* Division created to provide styling of section to the form */}
        <div className="section">

        {/* Form for to write the blog */}
            <form onSubmit={handleSubmit}>

                {/* Row component to create a row for first input field */}
                <Row label="Title">
                        <input className="input"
                                placeholder="Enter the Title of the Blog here.."
                                value ={formData.title}
                                ref = {titleRef}
                                onChange={(e)=> setFormData({title:e.target.value, content:formData.content})} 
                                //we need to mention the keys even though they are not getting updated at this instance because it is an object and we need to update the whole object
                            />
                </Row >

                {/* Row component to create a row for Text area field */}
                <Row label="Content">
                        <textarea className="input content"
                                placeholder="Content of the Blog goes here.."
                                value= {formData.content}
                                required
                                onChange={(e)=> setFormData({title: formData.title, content: e.target.value})}
                            />
                </Row >

                {/* Button to submit the blog */}            
                <button className = "btn">ADD</button>
            </form>
                     
        </div>

        <hr/>

        {/* Section where submitted blogs will be displayed */}

        <h2> Blogs </h2>
            {blogs.map((blog,i) =>(
                <div className="blog" key={i}>
                    <h3>{blog.title}</h3>
                    <p>{blog.content}</p>

                    <div className="blog-btn">
                        <button onClick={()=> {
                            removeBlog(blog.id)
                        }}
                        className="btn remove">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        
        </>
        )
    }

//Row component to introduce a new row section in the form
function Row(props){
    const{label} = props;
    return(
        <>
        <label>{label}<br/></label>
        {props.children}
        <hr />
        </>
    )
}