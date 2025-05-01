package org.example.bitirmeprojesi.exception;


import lombok.extern.slf4j.Slf4j;
import org.example.bitirmeprojesi.exception.error.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Objects;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    public static final String DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE = ErrorMesage.DEFAULT_INTERNAL_SERVER_ERROR;

    @ExceptionHandler({Exception.class, Throwable.class})
    public ResponseEntity<Object> internalExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<Object> accountNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.ACCOUNT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Object> productNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<Object> categoryNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.CATEGORY_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OrderNotFoundExceiption.class)
    public ResponseEntity<Object> orderNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.ORDER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ShoppingCartItemNotFoundException.class)
    public ResponseEntity<Object> shoppingCartItemNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OrderItemNotFoundException.class)
    public ResponseEntity<Object> orderItemNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.ORDER_ITEM_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DeliveryNotFoundException.class)
    public ResponseEntity<Object> deliveryNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.DELIVERY_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FavouriteNotFoundException.class)
    public ResponseEntity<Object> favouriteNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.FAVOURITE_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserIdNotFoundException.class)
    public ResponseEntity<Object> userIdNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.USER_ID_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<Object> shoppingCartOverFlowExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.INSUFFICIENT_STOCK_ERROR, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidProductInformationException.class)
    public ResponseEntity<Object> invalidProductInformationExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.INVALID_PRODUCT_INFORMATION_ERROR, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(QueryNotFoundException.class)
    public ResponseEntity<Object> queryNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.QUERY_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);}

    @ExceptionHandler(ConflictProductAndCategoryException.class)
    public ResponseEntity<Object> conflictProductAndCategoryHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);


        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.CONFLICT_PRODUCT_AND_CATEGORY, HttpStatus.CONFLICT);
    }
    @ExceptionHandler(InvalidVerificationCodeException.class)
    public ResponseEntity<Object> invalidVerificationCodeExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.INVALID_VERIFICATION_CODE, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ExistingProductException.class)
    public ResponseEntity<Object> existingProductExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);
        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ?ex.getLocalizedMessage():ErrorMesage.EXISTING_PRODUCT_ERROR,HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(CodeNotFoundException.class)
    public ResponseEntity<Object> codeNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.CODE_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ReviewNotFoundException.class)
    public ResponseEntity<Object> reviewNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.REVIEW_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateReviewException.class)
    public ResponseEntity<Object> invalidReviewInformationExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.INVALID_REVIEW_INFORMATION_ERROR, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<Object> paymentNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.PAYMENT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ExistByEmailException.class)
    public ResponseEntity<Object> existByEmailExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.EMAIL_ALREADY_EXISTS_ERROR, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(InsufficientBalanceError.class)
    public ResponseEntity<Object> insufficientBalanceExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.INSUFFICIENT_BALANCE_ERROR, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(JwtNotFoundException.class)
    public ResponseEntity<Object> jwtNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.JWT_TOKEN_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(DeliveredOrderShouldBeRefundedException.class)
    public ResponseEntity<Object> deliveredOrderShouldBeRefundedExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.DELIVERED_ORDER_SHOULD_BE_REFUNDED_ERROR, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CancellationNotFoundException.class)
    public ResponseEntity<Object> cancellationNotFoundExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.CANCELLATION_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PaymentNotSuccessfulCancellationException.class)
    public ResponseEntity<Object> paymentNotSuccessfulCancellationExceptionHandler(Exception ex) {
        log.error(ex.getLocalizedMessage(), ex);

        return buildErrorResponse(Objects.nonNull(ex.getLocalizedMessage()) ? ex.getLocalizedMessage() : ErrorMesage.PAYMENT_NOT_SUCCESSFUL_CANCELLATION_ERROR, HttpStatus.BAD_REQUEST);
    }


    private ResponseEntity<Object> buildErrorResponse(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(new ExceptionResponse(message, status));
    }
}
