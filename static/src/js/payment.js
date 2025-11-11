/** @odoo-module */

import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { usePos } from "@point_of_sale/app/store/pos_hook";

patch(PaymentScreen.prototype, {
      setup() {
        super.setup();
        this.orm = useService("orm");
        this.pos = usePos();
      },
async validateOrder(isForceValidate) {
    const receipt_order = await super.validateOrder(isForceValidate);

    
    if (!receipt_order) {
        return receipt_order;
    }

    const data = this.env.services.pos.session_orders || [];

    if (!Array.isArray(data) || data.length === 0) {
        console.warn("[pos_receipt_extend] Sin datos de session_orders, omito campos extra.");
        return receipt_order;
    }

    const order = data[data.length - 1];
console.log("Prueba de aparicion de "+"order:", order);
    if (!order) {
        console.warn("[pos_receipt_extend] Último registro vacío, omito campos extra.");
        return receipt_order;
    }

    this.pos.customer_details = order.customer_details || "";
    this.pos.mobile           = order.customer_mobile || "";
    console.log("Prueba de aparicion de "+"Customer Mobile:", this.pos.mobile);
    this.pos.phone            = order.customer_phone || "";
    console.log("Prueba de aparicion de "+"Customer Phone:", this.pos.phone);
    this.pos.email            = order.customer_email  || "";
    this.pos.vat              = order.customer_vat    || "";
    this.pos.address          = order.customer_address || "";
    this.pos.name             = order.customer_name   || "";
    console.log("Prueba de aparicion de "+"Customer Name:", this.pos.name);

    return receipt_order;
}

});
