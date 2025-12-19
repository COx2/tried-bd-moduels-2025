/**
 * WebKnobMan Filmstrip Splitter
 * 
 * WebKnobManで出力したフィルムストリップ画像を個別のフレームに分解します。
 * 
 * Usage:
 *   deno run --allow-read --allow-write split_filmstrip.ts <input.png> <output_dir> [frames]
 * 
 * Arguments:
 *   input.png   - 入力フィルムストリップ画像（WebKnobMan出力）
 *   output_dir  - 出力先ディレクトリ
 *   frames      - フレーム数（省略時は128）
 * 
 * Example:
 *   deno run --allow-read --allow-write split_filmstrip.ts knob_filmstrip.png frames/ 128
 */

import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import { ensureDir } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";

interface SplitOptions {
    inputFile: string;
    outputDir: string;
    numFrames: number;
    prefix?: string;
}

/**
 * フィルムストリップ画像を個別フレームに分解
 */
async function splitFilmstrip(options: SplitOptions): Promise<void> {
    const { inputFile, outputDir, numFrames, prefix = "frame" } = options;

    console.log(`🎨 Loading filmstrip: ${inputFile}`);
    
    // 画像を読み込み
    const imageData = await Deno.readFile(inputFile);
    const image = await Image.decode(imageData);
    
    const width = image.width;
    const height = image.height;
    const frameHeight = Math.floor(height / numFrames);
    
    console.log(`📐 Image dimensions: ${width}x${height}`);
    console.log(`🎞️  Frame dimensions: ${width}x${frameHeight}`);
    console.log(`🔢 Number of frames: ${numFrames}`);
    
    if (height % numFrames !== 0) {
        console.warn(`⚠️  Warning: Image height (${height}) is not evenly divisible by frame count (${numFrames})`);
    }

    // 出力ディレクトリを作成
    await ensureDir(outputDir);
    console.log(`📁 Output directory: ${outputDir}`);
    console.log("");

    // 各フレームを抽出して保存
    for (let i = 0; i < numFrames; i++) {
        const yStart = i * frameHeight;
        const yEnd = yStart + frameHeight;
        
        // 新しい画像を作成してピクセルをコピー
        const frame = new Image(width, frameHeight);
        
        // ピクセルごとにコピー
        for (let y = 0; y < frameHeight; y++) {
            for (let x = 0; x < width; x++) {
                const sourceY = yStart + y;
                if (sourceY < height) {
                    const bitmap = image.bitmap;
                    const frameBitmap = frame.bitmap;

                    const sourceIndex = ((sourceY * width) + x) * 4;
                    const targetIndex = ((y * width) + x) * 4;

                    frameBitmap[targetIndex + 0] = bitmap[sourceIndex + 0]; // R
                    frameBitmap[targetIndex + 1] = bitmap[sourceIndex + 1]; // G
                    frameBitmap[targetIndex + 2] = bitmap[sourceIndex + 2]; // B
                    frameBitmap[targetIndex + 3] = bitmap[sourceIndex + 3]; // A
                }
            }
        }
        
        // ファイル名を生成（3桁ゼロパディング）
        // const frameNumber = String(i).padStart(3, "0");
        const frameNumber = String(i);
        const outputFile = `${outputDir}/${prefix}_${frameNumber}.png`;
        
        // PNG形式で保存
        const encoded = await frame.encode();
        await Deno.writeFile(outputFile, encoded);
        
        // 進捗表示
        if ((i + 1) % 10 === 0 || i === numFrames - 1) {
            console.log(`✅ Saved ${i + 1}/${numFrames} frames`);
        }
    }

    console.log("");
    console.log(`🎉 Successfully split ${numFrames} frames to ${outputDir}`);
}

/**
 * コマンドライン引数をパース
 */
function parseArgs(args: string[]): SplitOptions {
    const flags = parse(args, {
        string: ["prefix"],
        default: {
            prefix: "frame",
        },
    });

    const [inputFile, outputDir, framesStr] = flags._;

    if (!inputFile || !outputDir) {
        console.error("Usage: split_filmstrip.ts <input.png> <output_dir> [frames]");
        console.error("");
        console.error("Arguments:");
        console.error("  input.png   - Input filmstrip image (WebKnobMan output)");
        console.error("  output_dir  - Output directory for individual frames");
        console.error("  frames      - Number of frames (default: 128)");
        console.error("");
        console.error("Options:");
        console.error("  --prefix    - Filename prefix for output frames (default: 'frame')");
        console.error("");
        console.error("Example:");
        console.error("  deno run --allow-read --allow-write split_filmstrip.ts knob.png frames/ 128");
        Deno.exit(1);
    }

    const numFrames = framesStr ? parseInt(String(framesStr), 10) : 128;

    if (isNaN(numFrames) || numFrames <= 0) {
        console.error(`Error: Invalid frame count: ${framesStr}`);
        Deno.exit(1);
    }

    return {
        inputFile: String(inputFile),
        outputDir: String(outputDir),
        numFrames,
        prefix: flags.prefix,
    };
}

/**
 * メイン処理
 */
async function main() {
    console.log("🎬 WebKnobMan Filmstrip Splitter");
    console.log("================================");
    console.log("");

    try {
        const options = parseArgs(Deno.args);
        await splitFilmstrip(options);
    } catch (error) {
        console.error("❌ Error:", error.message);
        Deno.exit(1);
    }
}

// スクリプト実行
if (import.meta.main) {
    main();
}