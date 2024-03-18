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

let cart = [];

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
  //
})

checkoutBtn.addEventListener("click", function() {
  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
  }
})


