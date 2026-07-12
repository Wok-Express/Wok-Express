//==============================
//      CONFIGURACIÓN
//==============================

const DELIVERY = 5000;
const numeroWhatsApp = "573225197948";

let cart = [];

//==============================
//      ELEMENTOS
//==============================

const cartPanel = document.getElementById("cart");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const cartCount = document.getElementById("cart-count");

const checkout = document.getElementById("checkout");
const checkoutModal = document.getElementById("checkoutModal");
const orderForm = document.getElementById("orderForm");

//==============================
//      ABRIR CARRITO
//==============================

openCart.addEventListener("click",()=>{

    cartPanel.classList.add("active");

});

closeCart.addEventListener("click",()=>{

    cartPanel.classList.remove("active");

});

//==============================
//      BOTONES AGREGAR
//==============================

document.querySelectorAll(".add-cart").forEach(btn=>{

    btn.addEventListener("click",()=>{

        addToCart(

            btn.dataset.name,

            Number(btn.dataset.price)

        );

    });

});

//==============================
//      AGREGAR PRODUCTO
//==============================

function addToCart(nombre,precio){

    const existe = cart.find(p=>p.nombre===nombre);

    if(existe){

        existe.cantidad++;

    }else{

        cart.push({

            nombre:nombre,

            precio:precio,

            cantidad:1

        });

    }

    guardarCarrito();

    renderCart();

    mostrarToast("Producto agregado");

}

//==============================
//      ELIMINAR
//==============================

function removeItem(nombre){

    const index = cart.findIndex(p=>p.nombre===nombre);

    if(index==-1) return;

    cart[index].cantidad--;

    if(cart[index].cantidad<=0){

        cart.splice(index,1);

    }

    guardarCarrito();

    renderCart();

}
//==============================
//      RENDER DEL CARRITO
//==============================

function renderCart(){

    cartItems.innerHTML = "";

    let subtotal = 0;
    let cantidad = 0;

    if(cart.length === 0){

        cartItems.innerHTML = `

        <div class="empty-cart">

            <i class="fa-solid fa-cart-shopping"></i>

            <h3>Tu carrito está vacío</h3>

            <p>Agrega productos para comenzar.</p>

        </div>

        `;

    }else{

        cart.forEach(item=>{

            const totalProducto = item.precio * item.cantidad;

            subtotal += totalProducto;

            cantidad += item.cantidad;

            cartItems.innerHTML += `

            <div class="cart-item">

                <div>

                    <h4>${item.nombre}</h4>

                    <p>

                        ${item.cantidad} x $${item.precio.toLocaleString("es-CO")}

                    </p>

                </div>

                <button onclick="removeItem('${item.nombre}')">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

            `;

        });

    }

    cartCount.textContent = cantidad;

    subtotalElement.textContent = "$" + subtotal.toLocaleString("es-CO");

    totalElement.textContent = "$" + (subtotal + DELIVERY).toLocaleString("es-CO");

}

//==============================
//      LOCAL STORAGE
//==============================

function guardarCarrito(){

    localStorage.setItem(

        "wokexpress_cart",

        JSON.stringify(cart)

    );

}

function cargarCarrito(){

    const datos = localStorage.getItem("wokexpress_cart");

    if(datos){

        cart = JSON.parse(datos);

    }

}

//==============================
//      TOAST
//==============================

function mostrarToast(texto){

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>${texto}</span>

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
//      ABRIR CHECKOUT
//==============================

checkout.addEventListener("click",()=>{

    if(cart.length===0){

        alert("Debes agregar al menos un producto.");

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

    if(!nombre || !direccion || !barrio || !telefono){

        alert("Completa todos los datos.");

        return;

    }

    let totalPedido=0;

    let mensaje="WOK EXPRESS\n\n";

    mensaje+="NUEVO PEDIDO\n\n";

    mensaje+="Cliente:\n";
    mensaje+=nombre+"\n\n";

    mensaje+="Dirección:\n";
    mensaje+=direccion+"\n\n";

    mensaje+="Barrio:\n";
    mensaje+=barrio+"\n\n";

    mensaje+="Teléfono:\n";
    mensaje+=telefono+"\n\n";

    mensaje+="========================\n";
    mensaje+="PEDIDO\n";
    mensaje+="========================\n\n";

    cart.forEach(item=>{

        const total=item.precio*item.cantidad;

        totalPedido+=total;

        mensaje+=item.cantidad+" x "+item.nombre+"\n";
        mensaje+="$"+total.toLocaleString("es-CO")+"\n\n";

    });

    mensaje+="========================\n";
    mensaje+="Domicilio: $5.000\n";
    mensaje+="TOTAL: $"+(totalPedido+DELIVERY).toLocaleString("es-CO")+"\n";
    mensaje+="========================";

    if(observaciones!=""){

        mensaje+="\n\nObservaciones:\n";
        mensaje+=observaciones;

    }

    window.open(

        "https://wa.me/"+numeroWhatsApp+"?text="+encodeURIComponent(mensaje),

        "_blank"

    );

    cart=[];

    guardarCarrito();

    renderCart();

    orderForm.reset();

    checkoutModal.classList.remove("active");

});
