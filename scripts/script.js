document.addEventListener("DOMContentLoaded", () => {

    /* MENU RESPONSIVE*/
    const menubutton = document.querySelector("#menu");
    const navbar = document.querySelector(".nav-bar");

    if (menubutton && navbar) {
        menubutton.addEventListener("click", () => {
            navbar.classList.toggle("show");
            menubutton.textContent = menubutton.textContent === "☰" ? "✖" : "☰";
        });
    }

    /* TOGGLE SOCIAL ICONS */
    const icons = document.querySelectorAll(".toggle-icon");

    icons.forEach(icon => {
        icon.addEventListener("error", () => {
            icon.style.opacity = 0.5;
        });

        icon.addEventListener("click", () => {
            const src = icon.getAttribute("src");
            const alt = icon.getAttribute("data-alt");
            if (alt) {
                icon.setAttribute("src", alt);
                icon.setAttribute("data-alt", src);
            }
        });
    });

    /*API MEALS*/
    const categoriesContainer = document.getElementById("categories");

    async function loadMeals(category) {
        categoriesContainer.innerHTML = "<p>Loading...</p>";
        try {
            const response = await fetch(
                `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
            );
            const data = await response.json();
            displayMeals(data.meals);
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const filterMap = {
        all: "Seafood",
        dessert: "Dessert",
        fastfood: "Chicken",
        kids: "Pasta"
    };

    loadMeals(filterMap.all);

    async function globalSearch(keyword) {
        if (!keyword.trim()) {
            // si la recherche est vide, on recharge la catégorie par défaut
            loadMeals(filterMap.all);
            return;
        }

        try {
            const response = await fetch(
                `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`
            );
            const data = await response.json();

            if (data.meals) {
                displayMeals(data.meals);
            } else {
                categoriesContainer.innerHTML = "<p>No results found</p>";
            }
        } catch (error) {
            console.error("Search API error:", error);
        }
    }

    document.querySelectorAll("a[data-filter]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const filterValue = link.getAttribute("data-filter");
            if (filterMap[filterValue]) {
                loadMeals(filterMap[filterValue]);
            }
        });
    });

    const searchInput = document.getElementById("search-input");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const value = searchInput.value.toLowerCase();
            globalSearch(value);
        });
    }


    /*PANIER*/
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartList = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const clearCartBtn = document.getElementById("clear-cart");

    function updateCartDisplay() {
        cartList.innerHTML = "";

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${item}<button class="remove-item" data-index="${index}">❌</button>`;
            cartList.appendChild(li);
        });
        cartCount.textContent = cart.length;
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", () => {
                const index = button.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartDisplay();
            })
        })
    }

    updateCartDisplay();


    function displayMeals(meals) {
        categoriesContainer.innerHTML = "";

        meals.forEach(meal => {
            const card = document.createElement("div");
            card.classList.add("categorie-card");

            card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <button class="add-cart">Add to Cart</button>
            `;

            const button = card.querySelector(".add-cart");
            button.addEventListener("click", () => {
                cart.push(meal.strMeal);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartDisplay();
                const toast = document.getElementById("toast");
                toast.style.display = "block";
                setTimeout(() => {
                    toast.style.display = "none";
                }, 2000);
            });

            categoriesContainer.appendChild(card);
        });
    }

    clearCartBtn.addEventListener("click", () => {
        cart = [];
        localStorage.removeItem("cart");
        updateCartDisplay();
    });

    /*COMMANDE*/
    const orderForm = document.getElementById("order-form");
    const orderMessage = document.getElementById("order-message");

    orderForm.addEventListener("submit", e => {
        e.preventDefault();

        if (cart.length === 0) {
            orderMessage.textContent = "Your cart is empty!";
            return;
        }

        const customerName = document.getElementById("fullname").value;

        orderMessage.textContent =
            `Thank you ${customerName}, your order has been placed successfully!`;

        cart = [];
        localStorage.removeItem("cart");
        updateCartDisplay();
        orderForm.reset();
        setTimeout(() => {
            // success message for order form
            window.location.href = "succes.html";
        }, 1500);
    });

});