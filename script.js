//==============================
//      VARIABLES
//==============================

const cart = [];
const DELIVERY = 5000;

const cartPanel = document.getElementById("cart");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const cartCount = document.getElementById("cart-count");

const buttons = document.querySelectorAll(".add-cart");

//==============================
//      ABRIR Y CERRAR
//==============================

openCart.addEventListener("click",()=>{

    cartPanel.classList.add("active");

});

closeCart.addEventListener("click",()=>{

    cartPanel.classList.remove("active");

});

//==============================
//      AGREGAR PRODUCTOS
//==============================

buttons.forEach(button=>{

    button.addEventListener("click",()=>{

        const name=button.dataset.name;

        const price=parseInt(button.dataset.price);

        addToCart(name,price);

    });

});

//==============================
//      AGREGAR
//==============================

function addToCart(name,price){

    const exist=cart.find(item=>item.name===name);

    if(exist){

        exist.quantity++;

    }else{

        cart.push({

            name,
            price,
            quantity:1

        });

    }

    renderCart();

}

//==============================
//      ELIMINAR
//==============================

function removeItem(name){

    const index=cart.findIndex(item=>item.name===name);

    if(index>-1){

        cart[index].quantity--;

        if(cart[index].quantity<=0){

            cart.splice(index,1);

        }

    }

    renderCart();

}

//==============================
//      RENDER
//==============================

function renderCart(){

    cartItems.innerHTML="";

    let subtotal=0;

    let count=0;

    if(cart.length===0){

        cartItems.innerHTML=`

        <div class="empty-cart">

            <i class="fa-solid fa-cart-shopping"></i>

            <h3>Tu carrito está vacío</h3>

            <p>Agrega productos para comenzar.</p>

        </div>

        `;

    }

    cart.forEach(item=>{

        subtotal+=item.price*item.quantity;

        count+=item.quantity;

        cartItems.innerHTML+=`

        <div class="cart-item">

            <div>

                <h4>${item.name}</h4>

                <p>

                    ${item.quantity} x $${item.price.toLocaleString()}

                </p>

            </div>

            <button onclick="removeItem('${item.name}')">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

    subtotalElement.innerText="$"+subtotal.toLocaleString();

    totalElement.innerText="$"+(subtotal+DELIVERY).toLocaleString();

    cartCount.innerText=count;

}

//==============================
//      CHECKOUT
//==============================

const checkout=document.getElementById("checkout");
const checkoutModal=document.getElementById("checkoutModal");
const orderForm=document.getElementById("orderForm");

checkout.addEventListener("click",()=>{

    if(cart.length===0){

        alert("Agrega al menos un producto.");

        return;

    }

    checkoutModal.classList.add("active");

});

checkoutModal.addEventListener("click",(e)=>{

    if(e.target===checkoutModal){

        checkoutModal.classList.remove("active");

    }

});

//==============================
//      ENVIAR PEDIDO
//==============================

orderForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const nombre=document.getElementById("nombre").value.trim();

    const direccion=document.getElementById("direccion").value.trim();

    const barrio=document.getElementById("barrio").value.trim();

    const telefono=document.getElementById("telefono").value.trim();

    const observaciones=document.getElementById("observaciones").value.trim();

    if(nombre===""){

        alert("Ingresa tu nombre.");

        return;

    }

    if(direccion===""){

        alert("Ingresa la dirección.");

        return;

    }

    if(barrio===""){

        alert("Ingresa el barrio.");

        return;

    }

    if(telefono===""){

        alert("Ingresa un teléfono.");

        return;

    }

    let subtotal=0;

    let mensaje="🍜 *WOK EXPRESS*%0A%0A";

    mensaje+="*NUEVO PEDIDO*%0A%0A";

    mensaje+="👤 *Cliente:* "+nombre+"%0A";

    mensaje+="📍 *Dirección:* "+direccion+"%0A";

    mensaje+="🏘️ *Barrio:* "+barrio+"%0A";

    mensaje+="📞 *Teléfono:* "+telefono+"%0A%0A";

    mensaje+="🛒 *PEDIDO*%0A";

    cart.forEach(item=>{

        const total=item.price*item.quantity;

        subtotal+=total;

        mensaje+="%0A";

        mensaje+=item.quantity+" x "+item.name;

        mensaje+=" - $"+total.toLocaleString();

    });

    mensaje+="%0A%0A";

    mensaje+="🚚 Domicilio: $5.000%0A";

    mensaje+="💰 Subtotal: $"+subtotal.toLocaleString()+"%0A";

    mensaje+="💵 TOTAL: $"+(subtotal+DELIVERY).toLocaleString()+"%0A";

    if(observaciones!=""){

        mensaje+="%0A📝 Observaciones:%0A";

        mensaje+=observaciones+"%0A";

    }

    //==============================
    // CAMBIA ESTE NÚMERO
    //==============================

    const numero="573225197948";

    window.open(

        "https://wa.me/"+numero+"?text="+mensaje,

        "_blank"

    );

    cart.length=0;

    renderCart();

    orderForm.reset();

    checkoutModal.classList.remove("active");

});

//==============================
//      LOCAL STORAGE
//==============================

function saveCart(){

    localStorage.setItem("wokexpress_cart",JSON.stringify(cart));

}

function loadCart(){

    const saved=localStorage.getItem("wokexpress_cart");

    if(saved){

        const data=JSON.parse(saved);

        data.forEach(item=>cart.push(item));

        renderCart();

    }

}

const originalRender=renderCart;

renderCart=function(){

    originalRender();

    saveCart();

};

//==============================
//      NOTIFICACIÓN
//==============================

function showToast(message){

    const toast=document.createElement("div");

    toast.className="toast";

    toast.innerHTML=`
        <i class="fa-solid fa-circle-check"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },2200);

}

//==============================
//      BOTONES
//==============================

buttons.forEach(button=>{

    button.addEventListener("click",()=>{

        showToast("Producto agregado al carrito");

    });

});

//==============================
//      INICIAR
//==============================

loadCart();

renderCart();

//==============================
//      ANIMACIÓN SCROLL
//==============================

const observer=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("visible");

        }

    });

},{
    threshold:.15
});

document.querySelectorAll(".card,.item,.history,.schedule-box,.location-info").forEach(el=>{

    observer.observe(el);

});

//==============================
//      BOTÓN VOLVER ARRIBA
//==============================

const topButton=document.createElement("button");

topButton.innerHTML='<i class="fa-solid fa-arrow-up"></i>';

topButton.className="topButton";

document.body.appendChild(topButton);

window.addEventListener("scroll",()=>{

    if(window.scrollY>400){

        topButton.classList.add("show");

    }else{

        topButton.classList.remove("show");

    }

});

topButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

//==============================
//      CERRAR CARRITO CON ESC
//==============================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        cartPanel.classList.remove("active");

        checkoutModal.classList.remove("active");

    }

});

//==============================
//      EFECTO NAVBAR
//==============================

const navbar=document.querySelector(".navbar");

window.addEventListener("scroll",()=>{

    if(window.scrollY>50){

        navbar.style.background="#111";

        navbar.style.padding="12px 8%";

    }else{

        navbar.style.background="rgba(0,0,0,.75)";

        navbar.style.padding="18px 8%";

    }

});

console.log("%c🍜 Wok Express","font-size:22px;color:#d62828;font-weight:bold;");
console.log("%cSitio desarrollado con HTML, CSS y JavaScript.","color:#555;");
