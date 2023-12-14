
$(document).ready(function() {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');

    loadProductDetails(productId);
});

function loadProductDetails(productId){
    $.ajax({
    type: "GET",
    url: "../xml/products.xml",
    dataType: "xml",
    success: function(xml) {
        var productDetails;

        $(xml).find('product').each(function() {
            var product = {}
            
            $(this).children().each(function() {
                var key = this.tagName.toLowerCase(); 
                var value = $(this).text();           
                product[key] = value;                 
            });

            if (product.id === productId){
                productDetails = product;
                return false
            }
        });
        
        if (productDetails) {
            displayProductDetails(productDetails); 
        
        } else {
            console.log("Product not found.");
        }
    }    
})
}

function displayProductDetails(product) {
var productHtml = `<div class="container mt-4"> \
                        <div class="row"> \
                            <div class="col-md-6"> \
                            <!-- Image Container --> \
                                <img src="../images/${product.image}" alt="${product.name}" class="img-fluid"> \
                            </div> \
                            <div class="col-md-6"> \
                                <h1>${product.name}</h1> \
                                <p>${product.description}</p> \
                                <p><strong>Price:</strong> ${product.price}</p> \
                                <p><strong>Category:</strong> ${product.category}</p> \
                                <p><strong>Availability:</strong> ${product.availability} Left</p> \
                                <p><strong>Seller:</strong> ${product.seller}</p> \
                                <button id="addToCartButton" style="margin-top:40px;margin-left:40px">Add to cart</button>
                                </div> \
                        </div> \
                        </div>`;

        $('#product-details').html(productHtml);
        $('#addToCartButton').data('product', product);
        $('#addToCartButton').on('click', addToCart);
}

function addToCart() { 
    var product = $(this).data('product');

    let cart = localStorage.getItem('cart');
    cart = cart ? cart.split(',') : [];

    cart.push(JSON.stringify(product));

    localStorage.setItem('cart', cart.join(','));

    console.log('Cart:', cart);

}



