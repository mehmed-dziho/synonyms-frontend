import Swal, { SweetAlertIcon } from "sweetalert2";

export class SwalUtils {

    public static showSwalToast(title: string, message: string, icon: SweetAlertIcon): void {
        Swal.fire({
            toast: true,
            position: "top-end",
            timer: 4000,
            title,
            text: message,
            icon,
            showConfirmButton: false
        });
    }

    public static showWarningSwalToast(message: string): void {
        SwalUtils.showSwalToast("Warning", message, "warning");
    }

    public static showErrorSwalToast(message: string): void {
        SwalUtils.showSwalToast("Error", message, "error");
    }

    public static showSuccessSwalToast(message: string): void {
        SwalUtils.showSwalToast("Success", message, "success");
    }
}
