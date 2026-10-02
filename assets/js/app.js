var cl= console.log;

const form=document.getElementById("form")
const Todo=document.getElementById("Todo")
const productId=document.getElementById("productId")
const spinner=document.getElementById("spinner")
const SubmitBtn=document.getElementById("SubmitBtn")
const UpdateBtn=document.getElementById("UpdateBtn")



const BASE_URL="https://xhr-1st-crud-default-rtdb.firebaseio.com";
const Product_URL=`${BASE_URL}/Product.json`;


let productarr=[];

//toggle
function Ontoggle(){
    spinner.classList.toggle("d-none");
}

//Templating

function Templating(arr){
    let result=``;
    arr.forEach(ele =>{
        result+=`<li class="list-group-item d-flex justify-content-between align-items-center" id="${ele.id}">
                        <strong>${ele.product}</strong>
                        <div>
                        <i onclick="OnEdit(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                        <i onclick="OnDelete(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                        </div>
                        </li>`
    });
    productId.innerHTML=result;
}

//Read

function OnRead(eve){
    let xhr= new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/Product.json`)
    Ontoggle();
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >=200 && xhr.status <= 299){
            let res= JSON.parse(xhr.response)
            productarr=[];
            for(const key in res){
                res[key].id=key;
                productarr.push(res[key]);
            }
            Templating(productarr);

        }else{
            cl("error")
        }
                Ontoggle();

    }
}
OnRead();

//Create

function CreateTodo(ele){
    ele.preventDefault();
    let obj={
        product:Todo.value.trim()
    }
    let xhr= new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/Product.json`)   
        Ontoggle();
    xhr.send(JSON.stringify(obj)); 
    xhr.onload=function(){
    if(xhr.status >= 200 && xhr.status <=299){
    let res= JSON.parse(xhr.response)
    let li=document.createElement("li");
    cl(res)
    li.id=res.name;
    li.className="list-group-item d-flex justify-content-between align-items-center mb-2"
    li.innerHTML=`
                 <strong>${obj.product}</strong>
                <div>
                 <i onclick="OnEdit(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                <i onclick="OnDelete(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                </div>
                </li>`
                productId.append(li)
                form.reset();
                Swal.fire({
                        title: "Created!",
                        text: "Your file has been Created succsesfully.",
                        icon: "success"
                    });
        
        }else{
            cl("error")
        }
            Ontoggle();
        
    }

    }


//Edit
function OnEdit(eve){
    let Edit_Id = eve.closest("li").id;
    localStorage.setItem("Edit_Id",Edit_Id)
    let xhr= new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/Product/${Edit_Id}.json`);
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <=299){
    let res= JSON.parse(xhr.response)
    Todo.value=res.product;
            SubmitBtn.classList.add("d-none");
            UpdateBtn.classList.remove("d-none")
        }else{
            cl("error")
    }

}
}

//update

function Onupdate(eve){
    let Update_Id=localStorage.getItem("Edit_Id")
    let Upobj={
        id:Update_Id,
        product:Todo.value
    }
    let xhr= new XMLHttpRequest();
    xhr.open("PATCH",`${BASE_URL}/Product/${Update_Id}.json`);
         Ontoggle();
        xhr.send(JSON.stringify(Upobj));
        xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res= JSON.parse(xhr.response);
            let li=document.getElementById(Update_Id);
            li.querySelector("strong").innerHTML=Todo.value;
            SubmitBtn.classList.remove("d-none");
            UpdateBtn.classList.add("d-none");
            localStorage.removeItem("Edit_Id")
            form.reset();
             Swal.fire({
                        title: "Updated!",
                        text: `Your file has been Updated with id ${Update_Id}`,
                        icon: "success"
                    });

        }else{
            cl("error")
        }
             Ontoggle();

    }
}




//Delete

function OnDelete(eve){
    let Remove_Id=eve.closest("li").id;
    let confirmation=confirm("Are you sure to Delete??")
    if (confirmation){
        let xhr= new XMLHttpRequest();
        xhr.open("DELETE",`${BASE_URL}/Product/${Remove_Id}.json`)
             Ontoggle();
            xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            eve.closest("li").remove();
            Swal.fire({
                        title:`Deleted id ${Remove_Id}!`,
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
        }else{
            cl("error")
        }
          Ontoggle();
    }
    }
  }

  


form.addEventListener("submit", CreateTodo);
UpdateBtn.addEventListener("click",Onupdate)