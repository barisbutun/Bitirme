package org.example.bitirmeprojesi.validator;

import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.enums.StockState;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.InvalidProductInformationException;
import org.springframework.stereotype.Component;

@Component
public class ProductValidator {

        public void checkStokState(ProductDto productDto,Product product) {

            if(productDto.getStockState() == null||productDto.getQuantity()!=null){
                productDto.setStockState(StockState.AVAILABLE);
                product.setStockState(StockState.AVAILABLE);
            }
            else{
                throw new InvalidProductInformationException(ErrorMesage.INVALID_PRODUCT_INFORMATION_ERROR);
            }
        }


}
