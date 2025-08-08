function generateBasicBill(bill, items) {
  const billItems = bill.billItems.map(billItem => {
    const item = items.find(i => i.id === billItem.id);
    return {
      id: billItem.id,
      name: item.itemName,
      quantity: billItem.quantity
    };
  });

  return {
    id: bill.id,
    billNumber: bill.billNumber,
    opentime: bill.opentime,
    customerName: bill.customerName,
    billItems: billItems
  };
}


function generateDetailedBill(bill, items, categories) {
  let totalAmount = 0;

  const billItems = bill.billItems.map(billItem => {
    const item = items.find(i => i.id === billItem.id);
    const category = categories.find(c => c.id === item.category.categoryId);

    let baseAmount = item.rate * billItem.quantity;

    if (billItem.discount) {
      const discountRate = billItem.discount.rate;
      if (billItem.discount.isInPercent === 'Y') {
        baseAmount -= (baseAmount * discountRate) / 100;
      } else {
        baseAmount -= discountRate;
      }
    }

    let taxAmount = 0;
    const taxes = item.taxes.map(tax => {
      let taxValue = 0;
      if (tax.isInPercent === 'Y') {
        taxValue = (baseAmount * tax.rate) / 100;
      } else {
        taxValue = tax.rate;
      }
      taxAmount += taxValue;
      return {
        name: tax.name,
        rate: tax.rate,
        isInPercent: tax.isInPercent
      };
    });

    const finalAmount = baseAmount + taxAmount;
    totalAmount += finalAmount;

    return {
      id: billItem.id,
      name: item.itemName,
      quantity: billItem.quantity,
      discount: billItem.discount,
      taxes: taxes,
      amount: finalAmount,
      superCategoryName: category.superCategory.superCategoryName,
      categoryName: category.categoryName
    };
  });

  return {
    id: bill.id,
    billNumber: bill.billNumber,
    opentime: bill.opentime,
    customerName: bill.customerName,
    billItems: billItems,
    TotalAmount: totalAmount
  };
}
