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



    // 2. Llamar al método original
    const res = await super.validateOrder(isForceValidate);

    // Si el POS cancela la validación (por ejemplo, pago incompleto), res puede ser false/undefined
    // if (!res) {



    //   console.log("El pedido no fue validado, se cancela la operación.");
    //     return res;
    // }





    if (partner) {

    this.pos.mobile = partner.mobile || "";

    this.pos.phone = partner.phone || "";
    
    this.pos.email = partner.email || "";
    this.pos.vat = partner.vat || "";
    this.pos.address = partner.address || "";
    this.pos.name = partner.name || "";
   

    return res;
  }
}});
