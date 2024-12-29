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


    private ResponseEntity<Object> buildErrorResponse(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(new ExceptionResponse(message, status));
    }
}
