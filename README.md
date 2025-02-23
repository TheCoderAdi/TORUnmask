# **TOR Unmask 🚀**  
### **De-anonymizing TOR Traffic Using Machine Learning**  

## **📌 Overview**  
TOR (The Onion Router) enables anonymous communication, but it can also be exploited for cybercrime. **TOR Unmask** is a **machine learning-based system** that detects and classifies TOR and non-TOR network traffic using network flow analysis.  

## **💡 Features**  
✅ Detects whether a network flow is from **TOR or Non-TOR**  
✅ **98.8% accuracy** using **RandomForestClassifier**  
✅ Real-time classification with a **Flask API**  
✅ Feature selection for optimized **prediction speed**  
✅ **React.js frontend** for user-friendly testing  

---

## **🚀 Tech Stack**  
- **Machine Learning:** Scikit-Learn, Pandas, NumPy  
- **Backend:** Flask, Joblib, SMOTE  
- **Frontend:** React.js  
- **Deployment:** Flask API  

---

## **📂 Dataset & Features**  
The model is trained on a dataset with **15 selected network flow features**, after removing redundant ones.  

📌 **Selected Features:**  
```
Flow Duration, Flow Bytes/s, Flow Packets/s, Flow IAT Mean, Flow IAT Std, 
Flow IAT Max, Flow IAT Min, Fwd IAT Mean, Fwd IAT Std, Fwd IAT Max, 
Fwd IAT Min, Bwd IAT Mean, Bwd IAT Std, Bwd IAT Max, Bwd IAT Min
```  

---

## **🔧 Installation & Setup**  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/TheCoderAdi/TORUnmask
cd TOR-Unmask
```

### **2️⃣ Install Dependencies**  
```bash
pip install -r src/requirements.txt
```

### **3️⃣ Train the Model**  
```bash
python src/train.py
```
This will save the trained model as `best_model.pkl`.

### **4️⃣ Run the Flask API**  
```bash
python app.py
```
Flask API will start at:  
🔗 **http://127.0.0.1:5000/predict**  

### **5️⃣ Test with cURL**  
#### **Test Non-TOR Sample:**  
```bash
curl -X POST "http://127.0.0.1:5000/predict" -H "Content-Type: application/json" \
-d '{"features": [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0, 0.2, 0.4, 0.6, 0.8, 1.0]}'
```

#### **Test TOR Sample:**  
```bash
curl -X POST "http://127.0.0.1:5000/predict" -H "Content-Type: application/json" \
-d '{"features": [0.2, 0.3, 0.8, 0.1, 0.6, 0.7, 0.4, 0.5, 0.9, 0.3, 0.2, 0.8, 0.6, 0.1, 0.5]}'
```

---

## **🎯 Results & Performance**  
🔥 **Train Accuracy:** 99.95%  
🎯 **Test Accuracy:** 98.79%  
🔥 **F1-Score:** 96.47%  
⚡ **Precision:** 96.78%  
🔥 **Recall:** 96.18%  

---

## **📜 License**  
This project is **open-source** under the MIT License.  

---

## **📩 Contact**  
💬 **Developer:** Aditya Swayamsiddha  
🔗 **LinkedIn:** https://www.linkedin.com/in/aditya-swayamsiddha-576ab426a/

