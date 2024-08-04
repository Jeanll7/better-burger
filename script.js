const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

let cart = [];

addToCartButtons.forEach(button => {
  button.addEventListener("click", function () {
    showToast("Item adicionado ao carrinho");
  });
});

function showToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top", 
    position: "center", 
    style: {
      background: "#222",
      color: "#fff"
    },
  }).showToast();
}

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  updateCartModal();
})

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal || event.target === closeModalBtn) {
    cartModal.style.display = "none";
  }
})

menu.addEventListener("click", function(event) {
  // console.log(event.target)
  let parentButton = event.target.closest(".add-to-cart-btn")

  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

    // Adcionar no carrinho.
    addToCart(name, price)
  }
})

// Função para adicionar no carrinho 
function addToCart(name, price) {
  // Verificar se o item já está presente no carrinho
  const existingItem = cart.find(item => item.name === name)

  if (existingItem) {
    // Se o item já estiver no carrinho, aumente a quantidade
    existingItem.quantity++;
  } else {
    cart.push({ 
      name,
      price,
      quantity: 1,
    })
  }

  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <button class="remove-item text-red-600 font-medium hover:text-red-500">
          Remover
        </button>

      </div>
    `

    cartItemsContainer.appendChild(cartItemElement);

    // Adiciona o preço do item multiplicado pela quantidade ao total
    total += item.price * item.quantity;

    
  })
  // Atualiza o total no modal
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-item")) {
    const itemElement = event.target.closest(".flex-col"); 
    const name = itemElement.querySelector(".font-bold").textContent; 
    removeItemCart(name); 
  }
});

function removeItemCart(name) {
const index = cart.findIndex(item => item.name === name);

if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;      
    } else {
      cart.splice(index, 1)
    }
    
    updateCartModal();
  }
}

addressInput.addEventListener("input", function(event) {
  let inputValue = event.target.value;
  
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
})

checkoutBtn.addEventListener("click", function() {
  // Desabilitando a verificação do horário de funcionamento temporariamente
  const isOpen = checkRestaurantOpen()

  if (!isOpen) {
    Toastify({
      text: "Restaurante fechado no momento!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
      background: "#ef4444",
      }
    }).showToast();

    return;
  }
  // =======================================================================

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  // Enviar o pedido para api whatsApp
  const cartItems = cart.map((item) => {
    return (
      ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = phoneNumber;

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

  addressInput.value = "";

  cart = [];
  updateCartModal();

})

// Verificar a hora e manipular o card horário Seg á Sab - 18:30 as 23:30
function checkRestaurantOpen() {
  const data = new Date()
  const hora = data.getHours()
  const minutos = data.getMinutes();
  const diaDaSemana = data.getDay()

  const horaAbertura = 18.5; 
  const horaFechamento = 23.5; 
  return hora + minutos / 60 >= horaAbertura && hora + minutos / 60 < horaFechamento; 
}

function updateRestaurantStatus() {
  const spanItem = document.getElementById("date-span");
  const isOpen = checkRestaurantOpen();

  if(isOpen) {
    spanItem.classList.remove("bg-red-900")
    spanItem.classList.add("bg-green-600")
  } else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
  }
}

updateRestaurantStatus();

// Scroll top
const scrollToTopBtn = document.getElementById("scroll-top-btn");

scrollToTopBtn.style.display = "none"

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth" 
  });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) { 
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

