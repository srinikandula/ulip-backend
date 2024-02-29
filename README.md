**1.Project Title:-**
Unified Logistics Interface Portal (ULIP) API integrated web portal

**2.Problem Statement:-**
Currently in Mahindra Logistics, there are lots of Information systems being handled by different departments across the Company. But None of the Information Systems has an Integration with the Unified Logistics Interface Portal.

**3.Solution Approach:-**
An Application has to be designed and built to act as a Middleware for all the Information Systems across Mahindra Logistics which will be used to Call any API of ULIP to fetch the relevant Data for their usage.

**4.How to Access:-** 
<ol>
    <li>Users can Login either using their Credentials directly.</li>
     <li>New Users will need to connect with the Super Admin to get the access to LogiFreight.</li></ol>

**5.How to Use Backend:-**
<ol>
      <li> Go to the backend directory.</li>
       <li>Install all packages from npm i</li>
  <li>Run backend from node index.js</li></ol>  
  
**6.How to use Frontend:-** 
<ol>
     <li>  	Go to the frontend directory.</li>
       <li>	Install all packages from npm i - - force</li>
       <li>	Install an additional package from  npm i engine.io-parser@5.2.1 --force</li>
       <li>	Run frontend from ng serve</li>
       <li>The frontend is running at port 4200</li></ol>
       
**7.Direction for the Backend:-** 
<ol><li>
       

        Creating user : Make a POST request :<br>
           curl  -X POST \
           'http://localhost:5000/user/signup' \
           --header 'Accept: /' \
           --header 'Content-Type: application/json' \
           --data-raw '{
                        "username":"ser",
                        "name":"name",
                        "password":"12345678",
                        "contactNo":"9999999999",
                        "email":"amankumar@gmail.com"
                       }'
        
       
</li>
<li>Go to the frontend to login with the given credentials: <br>
           Username:user,
           Password:12345678
           (You can set your own username and password while creating a user.)
        </li>
    </ol>
    <br>           

**8.Making a ULIP request-**
       1.	Create an API Key from  frontend and copy passkey and secret key as  api-key and seckey from the frontend and do the following API request.
       
          i. The CURL code for making a POST request at VAHAAN :
          
            curl --location 'http://localhost:5000/aping/ulip/v1.0.0/VAHAN/01' \
            --header 'Accept: application/json' \
            --header 'Content-Type: application/json' \
            --header 'api-key: e656eb18-d8e7-46a9-84be-b001563a0192' \
            --header 'seckey: af7c2266947338b325510eacba40ea6931e92bbe16824ef71ab3cee09bab03dd88ed07b11d4bbf378b2203b7b38af40f' \
            --data '{
                      "vehiclenumber": "DL12CX0574"
                    }'
          ii. The CURL code for making a POST request at  SARTHI:

            curl --location 'http://localhost:5000/aping/ulip/v1.0.0/SARATHI/01' \
            --header 'Accept: application/json' \
            --header 'Content-Type: application/json' \
            --header 'api-key: e656eb18-d8e7-46a9-84be-b001563a0192' \
            --header 'seckey: af7c2266947338b325510eacba40ea6931e92bbe16824ef71ab3cee09bab03dd88ed07b11d4bbf378b2203b7b38af40f' \
            --data '{
                        "dlnumber": "GJ04 20120005008",
                        "dob": "1987-05-26"
                    }'
          iii.The CURL code for making a POST request at  LDB:
            curl --location 'http://localhost:5000/aping/ulip/v1.0.0/LDB/01' \
            --header 'Accept: application/json' \
            --header 'Content-Type: application/json' \
            --header 'api-key: e656eb18-d8e7-46a9-84be-b001563a0192' \
            --header 'seckey: af7c2266947338b325510eacba40ea6931e92bbe16824ef71ab3cee09bab03dd88ed07b11d4bbf378b2203b7b38af40f' \
            --data '{
                       "containerNumber" : "ACMP1000010"
                    }'
          iv.The CURL code for making a POST request at  FOIS:
            curl --location 'http://localhost:5000/aping/ulip/v1.0.0/FOIS/01' \
            --header 'Content-Type: application/json' \
            --header 'Accept: application/json' \
            --header 'api-key: 08b31a18-daad-4a16-b217-7b9bdc2e6cbe' \
            --header 'seckey: dea053693414e695b0b94d045eff4dd1ac61824a162e65226cd66251b43f611079173b18a0c2f4694e24768d11527fc7' \
            --data '{
                      "fnrnumber": "21030407355"
                    }'
          v.The CURL code for making a POST request at FASTAG

             curl --location 'http://localhost:5000/aping/ulip/v1.0.0/FASTAG/01' \
             --header 'Accept: application/json' \
             --header 'Content-Type: application/json' \
             --header 'api-key: e656eb18-d8e7-46a9-84be-b001563a0192' \
             --header 'seckey: 07a4edadb8f9bcbb5a587e2f95f2c4102606cd742b224e000727b306b52a0854ee30c7af3a5996911339f71530fffcb3' \
             --data '{
                       "vehiclenumber" : "GA060000"
                     }'

