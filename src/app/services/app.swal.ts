import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class AppSwal {

    async showSuccess(msg: any, isShowCancelButton: any) {

        const selectOption = await Swal.fire({
            // icon: 'warning',
            title: "Success",
            text: msg,
        }).then((result) => {
            if (result.value) {
                return true;
            } else { return false; }
        });

        return selectOption;
    }

    async showWarning(msg: any, isShowCancelButton: any) { 
 
        const selectOption = await Swal.fire({ 
            // icon: "warning",
            title: "Oops...",
            text: msg,
        }).then((result) => { 
            if (result.value) { 
                return true; 
            } else { return false; } 
        }); 
 
        return selectOption; 
    }

    async showError(msg: any) {

        const selectOption = await Swal.fire({
            // icon: "error",
            title: "Oops...",
            text: msg,
        }).then((result) => {
            if (result.value) {
                return true;
            } else { return false; }
        });

        return selectOption;
    }

    async showOptionAdvance(msg: any, isShowCancelButton: any, html: any) {

        const selectOption = await Swal.fire({
            title: "Are you sure?",
            text: msg,
            // icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
            cancelButtonText: "Huỷ"
        }).then((result) => {
            if (result.value) {
                return true;
            } else { return false; }
        });

        return selectOption;
    }
}
