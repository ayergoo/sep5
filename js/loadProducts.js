var uniqueCategories = new Set();
var allProducts = []; 
var maxPrice = 0;

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "../xml/products.xml",
        dataType: "xml",
        success: function(xml) {
            $(xml).find('product').each(function() {
                var id = $(this).find('id').text();
                var name = $(this).find('name').text();
                var description = $(this).find('description').text();
                var category = $(this).find('category').text();
                var price = $(this).find('price').text();
                var image = $(this).find('image').text();

                if (price > maxPrice){
                    maxPrice = price;
                }

                if (category.indexOf(',') > -1){
                    var categories = category.split(',')
                    categories.forEach((element) => uniqueCategories.add(element));
                } else {
                    uniqueCategories.add(category);
                }

                var productHtml = '<div class="col-md-4 mb-4">' +
                                    '<a href="product-detail.html?id=' + id + '" class="card-link">' +
                                        // '<div class="card">' +
                                      '<div class="card" data-price="' + price + '" data-category="' + category +'" data-id="' + id +'">' +
                                          '<img src="../images/' + image + '" class="card-img-top" alt="' + name + '">' +
                                          '<div class="card-body">' +
                                              '<h5 class="card-title">' + name + '</h5>' +
                                            //   '<p class="card-text">' + description + '</p>' +
                                              '<p class="card-text">Price: ' + price + ' DKK</p>' +
                                          '</div>' +
                                      '</div>' +
                                  '</div>';
                allProducts.push({html: productHtml, category: category, price: price});
                $('#products-grid').append(productHtml);
            });
            generateCategoryFilters(uniqueCategories);
        },
        error: function() {
            console.error("An error occurred while processing XML file.");
        }
    });
});

function generateCategoryFilters(categories) {
    categories.forEach(function(category) {
        var filterHtml = '<div class="form-check">' +
                             '<input class="form-check-input" checked="True" type="checkbox" value="' + category + '" id="' + category + '">' +
                             '<label class="form-check-label" for="' + category + '">' + category + '</label>' +
                         '</div>';
        $('#category-filters').append(filterHtml);
    });
}


$('#filter-form').on('submit', function(event) {
    event.preventDefault();

    var selectedCategories = $('input[type=checkbox]:checked').map(function() {
        return this.value;
    }).get();

    var priceRange = $('#price-range').val();

    $('#products-grid').empty();

    allProducts.forEach(function(product) {
        var cat = product.category.split(',')
        if (cat.some(r => selectedCategories.includes(r)) && Number(product.price) <= priceRange) {
            $('#products-grid').append(product.html);
        }
    });
});

$('#price-range').on('input', function() {
    var rangeValue = $(this).val();
    $('#price-value').text('0 - ' + rangeValue);

});