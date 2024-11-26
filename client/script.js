async function login(event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById("pass").value;

    let datas = {
        email,
        password
    }

    console.log("datas from login :", datas);
    let json_data = JSON.stringify(datas);

    try {
        // Make the POST request to the server
        let response = await fetch("http://localhost:3005/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: json_data
        });


        // Check if response is OK (status code 2xx)
        if (response.ok) {
            let parsed_response = await response.json();
            console.log("parsed_response:", parsed_response);

            // Get user data and token
            let data = parsed_response.data;
            let token = parsed_response.data.token;
            console.log("data:", data);
            console.log("token:", token);

            // Save token to localStorage
            localStorage.setItem('authToken', token);

            let user_type = data.user_type;
            console.log("user_type:", user_type);

            // Show the alert first
            alert(parsed_response.message);


            if (user_type === "673d6d56751d8f9abf59f6fc") {
                window.location.href = "adminpage.html";
            } else {
                window.location.href = "getallproducts.html";
            }

        } else {
            // Handle unsuccessful response (non-2xx status codes)
            let parsed_response = await response.json();
            console.log("Error message:", parsed_response.message);
            alert(parsed_response.message);  // Show error message
        }
    } catch (error) {
        // Catch network errors
        console.error("Network error:", error);
        alert("An error occurred while trying to login. Please try again.");
    }
}

async function getAllProducts() {


    let params = new URLSearchParams(window.location.search);

    try {
        let response = await fetch(`/getproducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });



        if (response.ok) {
            let parsed_response = await response.json();
            console.log("parsed_response", parsed_response);

            let data = parsed_response.data  // Ensure data is an array
            console.log("data", data);

            let productsContainer = document.getElementById('productsContainer');
            let productData = '';


            for (let i = 0; i < data.length; i++) {
                let product = data[i];
                let imageUrl = product.image || '';



                productData += `
                    <div class="pt-5">
                        <div class="card" style="width: 18rem; height:370px;">
                            <img src="${imageUrl}" class="card-img-top" alt="Product Image" style="width: 286.4px; height:219px;">
                            <div class="card-body">
                                <h5 class="card-title">${product.name.slice(0, 50)}</h5>
                            
                                    <span >Price:$${product.price}</span>
                                  <div class="button" style="margin-top:10px">
                                   <button type="button" class="btn ">Add To Cart</button>
                                   </div>
                        
                            </div>
                            
                        </div>
                    </div>
                `;
            }


            productsContainer.innerHTML = productData;

        } else {
            // If the response isn't OK, log the error status
            console.error('Failed to fetch products. Status:', response.status);
        }
    } catch (error) {
        // Log any error that occurs during the fetch or parsing
        console.error('Error fetching products:', error);
    }
}
