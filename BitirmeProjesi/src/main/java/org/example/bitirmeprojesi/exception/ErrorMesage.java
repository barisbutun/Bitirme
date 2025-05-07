package org.example.bitirmeprojesi.exception;

public class ErrorMesage {

    public static final String DEFAULT_INTERNAL_SERVER_ERROR = "An error occured while processing the request";
    public static final String ACCOUNT_NOT_FOUND_ERROR="Account does not exist in our systems";
    public static final String PRODUCT_NOT_FOUND_ERROR="Product does not exist in our systems";
    public static final String CATEGORY_NOT_FOUND_ERROR="Category does not exist in our systems with {id}";
    public static final String ORDER_NOT_FOUND_ERROR="Order does not exist in our systems";
    public static final String ORDER_ITEM_NOT_FOUND_ERROR="Order Item does not exist in our systems";
    public static final String SHOPPING_CART_ITEM_NOT_FOUND_ERROR="Shopping Cart Item does not exist in our systems";
    public static final String DELIVERY_NOT_FOUND_ERROR="Delivery does not exist in our systems";
    public static final String FAVOURITE_NOT_FOUND_ERROR="Favourite does not exist in our systems";
    public static final String USER_ID_NOT_FOUND_ERROR="User Id does not exist in our systems";
    public static final String QUERY_NOT_FOUND_ERROR="Query does not exist in our systems with";
    public static final String INSUFFICIENT_STOCK_ERROR ="Shopping Cart is over flow";
    public static final String INVALID_PRODUCT_INFORMATION_ERROR="Product information is not valid";
    public static final String CONFLICT_PRODUCT_AND_CATEGORY="Product does not exist in Category";
    public static final String INVALID_VERIFICATION_CODE="Invalid verification code";
    public static final String CODE_NOT_FOUND_ERROR="Code does not exist in our systems";
    public static final String EXISTING_PRODUCT_ERROR ="Product exist in this system";
    public static final String REVIEW_NOT_FOUND_ERROR="Review does not exist in our systems";
    public static final String INVALID_REVIEW_INFORMATION_ERROR="You have already reviewed this product";
    public static final String EMAIL_ALREADY_EXISTS_ERROR ="Email already exist in our system";
    public static final String PAYMENT_NOT_FOUND_ERROR="Payment does not exist in our systems";
    public static final String INSUFFICIENT_BALANCE_ERROR="Insufficient balance";
    public static final String JWT_TOKEN_NOT_FOUND_ERROR="JWT Token does not exist in our systems";
    public static final String DELIVERED_ORDER_SHOULD_BE_REFUNDED_ERROR="Delivered order should be refunded";
    public static final String CANCELLATION_NOT_FOUND_ERROR="Cancellation does not exist in our systems";
    public static final String PAYMENT_NOT_SUCCESSFUL_CANCELLATION_ERROR="It is not possible to cancel a missing payment or a failed payment";
    public static final String EXIST_BY_SHOPPING_CART_ITEM_ERROR="That product already exist in our system";
    public static final String PAYMENT_NOT_COMPLETED_ERROR="Requesting a refund for products whose payment was not successful.";
    public static final String REFUND_NOT_FOUND_ERROR="Refund does not exist in our systems";
    public static final String CANCEL_QUANTITY_ERROR="Cancel quantity is not valid";
}
