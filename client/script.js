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
