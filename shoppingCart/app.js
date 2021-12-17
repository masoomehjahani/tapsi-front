// MODAL:
const cartBtn = document.querySelector(".cart-btn");
const backdrop = document.querySelector(".backdrop");
const modalContainer =document.querySelector(".modal-container");
const btnClear = document.querySelector(".clear");
const btnConfirm =document.querySelector(".confirm");
const increaseIcon =document.querySelector(".fa-angle-up");
const decreseIcon =document.querySelector(".fa-angle-down");
const counter = document.querySelector(".count");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");

let count =1;
let btnsDOM =[];
const productsDom =document.querySelector(".products-center");

import {productsData} from "./products.js";

let cart =[];

//function

     // SHOW PRODUCTS:
    //  1-get products 
  //can get from api  end point
class Products {
  getProducts(){
    return productsData;
  }
}
    
    // 2-display products :
 
class Ui{
   displayProducts(products){
     let result="";
     products.forEach(product => {
         result += `<div class="product">
         <div class="img-container">
             <img class="product-img" src=${product.imageUrl}>
         </div>
         <div class="product-desc">
         <p class="product-price">${product.price} $</p>
         <p class="product-title">${product.title}</p>
         </div>
         <button class="btn btn__primary btn__add" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to cart
         </button>
     </div>`;
     productsDom.innerHTML = result;
     });  
   }

   getAddTocartBtns(){
   const addTocartBtn = document.querySelectorAll(".btn__add");
   //    convert nodeList to array
   const buttons = [...addTocartBtn];
   btnsDOM = buttons;
   buttons.forEach(btn => {
       const id= btn.dataset.id;
      //check if this product id is in cart or no:
      const isInCart = cart.find(p => p.id === id);
      if (isInCart){
          btn.innerText = "in cart";
          btn.disabled = true;
      }
      //add to cart
     btn.addEventListener("click" , event =>{
        btn.innerText = "in cart";
    
       //1-get product from strorage(products)
       //event.target.dataset.id = id
      const addedProduct = {...Storage.getProduct(id), quantity:1};
       //2-add to cart
       //add previus cart item and new selected with quantity 1
       cart = [...cart, addedProduct];
       //3- save cart to storage
       Storage.saveCart(cart);

       //update cart quantity value
       this.setCartValue(cart);

     // add to cart item
      this.addCartItem(addedProduct);
     });//end of btn eventListner
   });//end of foreach
   }// end of add to cart func

//save to 
setCartValue (cart){
let tempCartItems =0;
const totalPrice = cart.reduce((acc , curr) =>{
     tempCartItems += curr.quantity;
     return acc + curr.quantity * curr.price;
},0)
cartTotal.innerText = `total price : ${totalPrice.toFixed(2)} $`;
cartItems.innerText = tempCartItems;
}
//add to cart item dom
addCartItem (cartItem){
const div = document.createElement("div");
div.classList.add("cart-item");
div.innerHTML =
 `<div> <img  class="cart-product-img"src=${cartItem.imageUrl}> </div> 
<div class="cart-product">
    <p class="cart-product-name">${cartItem.title}</p>
    <p class="cart-product-price">${cartItem.price} $</p>
</div>
<div class="counter">
    <i class="fa fa-angle-up" aria-hidden="true" data-id=${cartItem.id}></i>
   <p class="cart-count">${cartItem.quantity}</p>
    <i class="fa fa-angle-down" aria-hidden="true" data-id=${cartItem.id}></i>
</div>
<div>
    <i class="fa fa-trash" data-id=${cartItem.id}></i>
</div>`;
cartContent.appendChild(div);
}
// set up app:
setupApp (){
//   get cart from storage:
 //Storage.getCart() ? cart : []; 
 cart= Storage.getCart() || []; 
cart.forEach(cartItem => this.addCartItem(cartItem));
this.setCartValue (cart);
}

cartLogic(){
    btnClear.addEventListener("click", () => this.clearCart() );
    //update counter:
    cartContent.addEventListener("click", (event)=>{
      const addTarget = event.target;
      if (addTarget.classList.contains("fa-angle-up")){
         const addedItem= cart.find(p=> p.id == addTarget.dataset.id) ;
         addedItem.quantity +=1;
         this.setCartValue(cart);
         Storage.saveCart(cart);

         //update cart in ui
         addTarget.nextElementSibling.innerText=addedItem.quantity;
      }
      else if (addTarget.classList.contains("fa-trash")){
        const removedItem= cart.find(p=> p.id == addTarget.dataset.id) ;
        this.removeItem(removedItem.id);
        Storage.saveCart(cart);
        // console.log(event.target.parentElement.parentElement);
        //update cart in ui
        cartContent.removeChild(addTarget.parentElement.parentElement);
     }
      else if (addTarget.classList.contains("fa-angle-down")){
        const subItem= cart.find(p=> p.id == addTarget.dataset.id);
        if (subItem.quantity ===1)
        {
            this.removeItem(subItem.id);
            cartContent.removeChild(addTarget.parentElement.parentElement);
            return;
        }
        subItem.quantity -=1;
        this.setCartValue(cart);
        Storage.saveCart(cart);

        //update cart in ui
        addTarget.previousElementSibling.innerText=subItem.quantity;
     }
    });
}
clearCart(){
    cart.forEach(cItem => this.removeItem(cItem.id));
    //remove cart content children 
    while (cartContent.children.length){
        cartContent.removeChild(cartContent.children[0]);
    }
    closeModal();
}
removeItem (id){
cart = cart.filter(p => p.id !== id);
//update total price and cart utems
this.setCartValue(cart);
//update storage
Storage.saveCart(cart);

//get add to cart btn and change tex:
this.getSingleBtn(id);
}
getSingleBtn(id){
    const button = btnsDOM.find(btn => parseInt(btn.dataset.id) === parseInt(id));

    button.innerText = "add to cart";
    button.disabled = false;
}

}// end of ui class
    
//3-class storage
class Storage{
 static saveProducts(products){
     localStorage.setItem('products', JSON.stringify(products));
 }
 static getProduct(id){
     const savedProducts= JSON.parse(localStorage.getItem("products"));
    return savedProducts.find(p => p.id === parseInt(id));
 }
 static saveCart (cart){
     localStorage.setItem("cart",JSON.stringify(cart));
 }
 static getCart(){
    return JSON.parse(localStorage.getItem("cart"));
    
}
}

    //  MODAL
function showModal(){
    backdrop.style.display = "block";
    modalContainer.style.transform = "translateY(5vh)" ;
    modalContainer.style.opacity = "1" ;
}
function closeModal(){
    backdrop.style.display = "none";
    modalContainer.style.transform = "translateY(-200vh)" ;
    modalContainer.style.opacity = "0" ;
}
    //  COUNTER

// function decreseCount(){
//     if (count != 0 ) {
//     counter.innerText = --count ;}
// }

// addEvent  
   // products:

   // for time that loading page
   document.addEventListener("DOMContentLoaded" , () =>{
    const products = new Products();
    const productsData = products.getProducts();
     //set up:get cart and setup app
    const ui = new Ui();
    ui.setupApp();
    ui.displayProducts(productsData);
    ui.getAddTocartBtns();
    ui.cartLogic();
    Storage.saveProducts(productsData);
})
   // modal
cartBtn.addEventListener("click",showModal);
//btnClear.addEventListener("click", closeModal);
btnConfirm.addEventListener("click", closeModal);
// increaseIcon.addEventListener("click", increaseCount);
// decreseIcon.addEventListener("click",decreseCount);