import userModel from "../models/userModel.js"

//add items to user cart
const addToCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId] = 1;
        }
        else
        {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Item added to cart"})
        } 
    catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//remove items fr
const removeFromCart = async (req,res) =>  {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -= 1; 
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Item removed from cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//fetch user cart data
// Find your getCart function and update it like this:
// Remove your old getCart function and paste this exact code:
const getCart = async (req, res) => {
   try {
      // Find user by ID sent from the frontend token middleware
      let userData = await userModel.findById(req.body.userId);
      
      // 🛑 THE FIX: If the user database object comes back null, stop here!
      if (!userData) {
         return res.json({ success: false, message: "User not found in this database. Please re-login." });
      }

      // This line will no longer crash because we know userData is not null
      let cartData = await userData.cartData; 
      res.json({ success: true, cartData });

   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error fetching cart items" });
   }
}


export {addToCart, removeFromCart, getCart}