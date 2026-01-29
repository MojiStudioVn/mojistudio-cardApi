const { CardAPI } = require("./index");

// Tự động đọc từ .env hoặc tạo instance mới
const cardAPI = new CardAPI();

// ========== ĐỔI THẺ ==========

// 1. Gửi thẻ lên hệ thống
async function submitCard() {
  try {
    const result = await cardAPI.submitCard({
      telco: "VIETTEL",
      code: "312821445892982",
      serial: "10004783347874",
      amount: "50000",
      requestId: "323233",
    });
    console.log("Submit Card:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// 2. Kiểm tra trạng thái thẻ
async function checkCardStatus() {
  try {
    const result = await cardAPI.checkCardStatus({
      telco: "VIETTEL",
      code: "312821445892982",
      serial: "10004783347874",
      amount: "50000",
      requestId: "323233",
    });
    console.log("Check Card Status:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// 3. Lấy giá tẩy thẻ
async function getCardPrices() {
  try {
    const result = await cardAPI.getCardPrices();
    console.log("Card Prices:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ========== KIỂM TRA SERI ==========

// 4. Kiểm tra seri
async function checkSerial() {
  try {
    const result = await cardAPI.checkSerial({
      telco: "VIETTEL",
      serial: "20000203625855",
    });
    console.log("Check Serial:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ========== MUA THẺ ==========

// 5. Mua thẻ cào
async function buyCard() {
  try {
    const result = await cardAPI.buyCard({
      serviceCode: "Viettel",
      walletNumber: "0081083966",
      value: "10000",
      qty: "2",
      requestId: "113",
    });
    console.log("Buy Card:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// 6. Kiểm tra tồn kho
async function checkCardAvailability() {
  try {
    const result = await cardAPI.checkCardAvailability({
      serviceCode: "Viettel",
      value: "10000",
      qty: "2",
    });
    console.log("Check Availability:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// 7. Tải lại thẻ
async function redownloadCard() {
  try {
    const result = await cardAPI.redownloadCard({
      requestId: "113",
      orderCode: "S61797A53BCEEF",
    });
    console.log("Redownload Card:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ========== NẠP TOPUP ==========

// 8. Tạo lệnh nạp
async function createTopupOrder() {
  try {
    const result = await cardAPI.createTopupOrder({
      serviceCode: "vinatt",
      amount: "10000",
      qty: "1",
      requestId: "116",
      accountInfo: { phone: "0943793984" },
    });
    console.log("Create Topup Order:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// 9. Lấy trạng thái topup
async function getTopupStatus() {
  try {
    const result = await cardAPI.getTopupStatus({
      requestId: "116",
      orderCode: "R625931CC50F71",
    });
    console.log("Topup Status:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// 10. Lấy danh sách sản phẩm
async function getProductList() {
  try {
    const result = await cardAPI.getProductList();
    console.log("Product List:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// 11. Lấy số dư
async function getBalance() {
  try {
    const result = await cardAPI.getBalance();
    console.log("Balance:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Export các hàm để test
module.exports = {
  submitCard,
  checkCardStatus,
  getCardPrices,
  checkSerial,
  buyCard,
  checkCardAvailability,
  redownloadCard,
  createTopupOrder,
  getTopupStatus,
  getProductList,
  getBalance,
};

// Uncomment một trong các hàm dưới để test
// submitCard();
// checkCardStatus();
// getCardPrices();
// checkSerial();
// buyCard();
// checkCardAvailability();
// redownloadCard();
// createTopupOrder();
// getTopupStatus();
// getProductList();
// getBalance();
