// Get multiple clothing categories
Promise.all([
    fetch("https://dummyjson.com/products/category/mens-shirts?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/womens-dresses?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/mens-shoes?limit=10").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/womens-shoes?limit=10").then(res => res.json())
])
.then(([shirts, dresses, shoes, womensShoes]) => {
    const container = document.getElementById("productContainer");
    container.innerHTML = '';

    // Helper function to add products
    function addCategoryProducts(products, categoryName) {
        if (products.length > 0) {
            // Add category heading
            container.innerHTML += `<h3 class="category-heading">${categoryName}</h3>`;
            
            // Add products in this category
            products.forEach(product => {
                let displayCategory = product.category;
                if (product.category === 'mens-shirts') displayCategory = "Men's Shirts";
                else if (product.category === 'mens-shoes') displayCategory = "Men's Shoes";
                else if (product.category === 'womens-dresses') displayCategory = "Women's Dresses";
                else if (product.category === 'womens-shoes') displayCategory = "Women's Shoes";

                const productCard = `
                <div class="pro">
                    <img src="${product.images[0]}" alt="${product.title}">
                    <div class="des">
                        <span>${displayCategory}</span>
                        <h5>${product.title}</h5>
                        <div class="star">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4>$${product.price}</h4>
                        <a href="#"><i class="fa-solid fa-cart-shopping cart"></i></a>
                    </div>
                </div>
                `;
                container.innerHTML += productCard;
            });
        }
    }

    // Add categories in the order you want
    addCategoryProducts(shirts.products, "Men's Shirts");
    addCategoryProducts(dresses.products, "Women's Dresses");
    addCategoryProducts(shoes.products, "Men's Shoes");
    addCategoryProducts(womensShoes.products, "Women's Shoes");
})
.catch(error => {
    console.error('Error fetching products:', error);
    const container = document.getElementById("productContainer");
    if (container) {
        container.innerHTML = '<p style="color: red;">Sorry, failed to load products. Please try again later.</p>';
    }
});