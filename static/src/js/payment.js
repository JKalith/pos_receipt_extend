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
    // 1. Tomar referencia al pedido y al cliente **antes**
    const order   = this.currentOrder || this.env.services.pos.selectedOrder;
    const partner = order?.get_partner?.();

    console.log("Cliente ANTES de validar:", partner);

    // 2. Llamar al método original
    const res = await super.validateOrder(isForceValidate);
console.log("Resultado de la validación del pedido:", res);
    // Si el POS cancela la validación (por ejemplo, pago incompleto), res puede ser false/undefined
    // if (!res) {



    //   console.log("El pedido no fue validado, se cancela la operación.");
    //     return res;
    // }





console.log("Cliente DESPUÉS de validar:", partner);
    if (partner) {
    this.pos.customer_details = partner.customer_details || "";
    this.pos.mobile = partner.customer_mobile || "";
    console.log(
      "Prueba de aparicion de " + "Customer Mobile:",
      this.pos.mobile
    );
    this.pos.phone = partner.customer_phone || "";
    console.log("Prueba de aparicion de " + "Customer Phone:", this.pos.phone);
    this.pos.email = partner.customer_email || "";
    this.pos.vat = partner.customer_vat || "";
    this.pos.address = partner.customer_address || "";
    this.pos.name = partner.customer_name || "";
    console.log("Prueba de aparicion de " + "Customer Name:", this.pos.name);

    return res;
  }
}});
